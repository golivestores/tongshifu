"use client";

import { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/drinksome/SOM_bottle_v4_compressed.glb";

/** Linear interpolation helper (matches original ef.lerp) */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* ─── BottleModel — faithful match of original f5 ─── */
function BottleModel({
  scrollProgressRef,
  pointerRef,
  joinDropRectRef,
  isJoinDropActive,
  isFooterActive,
  isPillarsActive,
  originOffsetRef,
  onModelReady,
}: {
  scrollProgressRef: React.RefObject<{ current: number }>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
  joinDropRectRef: React.RefObject<DOMRect | null>;
  isJoinDropActive: boolean;
  isFooterActive: boolean;
  isPillarsActive: boolean;
  originOffsetRef: React.RefObject<number>;
  onModelReady?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);
  const readyFired = useRef(false);
  const { viewport, size, camera } = useThree();

  useEffect(() => {
    if (scene && !readyFired.current) {
      readyFired.current = true;
      onModelReady?.();
    }
  }, [scene, onModelReady]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        for (const mat of mats) {
          if (
            mat instanceof THREE.MeshStandardMaterial ||
            mat instanceof THREE.MeshPhysicalMaterial
          ) {
            mat.roughness = Math.min(1, mat.roughness + 0.6);
            mat.metalness = Math.max(0, 0.15 * mat.metalness);
            if ("clearcoat" in mat) {
              (mat as THREE.MeshPhysicalMaterial).clearcoat *= 0.1;
            }
            mat.envMapIntensity = 0.25;
            mat.needsUpdate = true;
          }
        }
      }
    });
    return clone;
  }, [scene]);

  const modelBounds = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const sz = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(sz);
    box.getCenter(center);
    return { size: sz, center };
  }, [clonedScene]);

  /* ─── Refs matching original f5 variables ─── */
  const stateRef = useRef({ x: 0, y: 0, z: 0, rotX: 0.12, rotY: 0, rotZ: 0.08, scale: 0.2 }); // p
  const smoothScrollRef = useRef(0); // f
  const elapsedRef = useRef(0); // m
  const smoothPointerRef = useRef({ x: 0, y: 0 }); // g
  const joinDropInfluenceRef = useRef(0); // y — smoothed 0→1
  const footerInfluenceRef = useRef(0); // _ — smoothed 0→1
  const mobileSnapRef = useRef<{ x: number; y: number; z: number; scale: number } | null>(null); // R
  const centerOffsetRef = useRef(new THREE.Vector3()); // b

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const u = stateRef.current;
    const scrollProg = scrollProgressRef.current?.current ?? 0;

    // Smooth scroll (original: .025 lerp)
    smoothScrollRef.current += (scrollProg - smoothScrollRef.current) * 0.025;
    const M = smoothScrollRef.current;

    // Section visibility
    let w = 0; // join-drop target influence
    let C: DOMRect | null = null; // join-drop rect
    let T: { x: number; y: number } | null = null; // join-drop center screen pos
    const B = viewport.width < 5; // isMobile

    if (isJoinDropActive && joinDropRectRef.current) {
      const rect = joinDropRectRef.current;
      w = 1;
      C = rect;
      T = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    } else if (!isJoinDropActive) {
      mobileSnapRef.current = null; // R.current = null
    }

    // Smooth join-drop influence (original: lerp factor depends on direction)
    const joinLerpFactor = w > joinDropInfluenceRef.current ? 0.12 : (B ? 0.06 : 0.3);
    joinDropInfluenceRef.current += (w - joinDropInfluenceRef.current) * joinLerpFactor;
    const L = joinDropInfluenceRef.current;

    // Smooth footer influence (original: lerp 0.08)
    footerInfluenceRef.current += ((isFooterActive ? 1 : 0) - footerInfluenceRef.current) * 0.08;
    const D = footerInfluenceRef.current;

    elapsedRef.current += delta;
    const t = elapsedRef.current;

    // Smooth pointer (original: .22 lerp)
    const ptr = pointerRef.current ?? { x: 0, y: 0 };
    const gRef = smoothPointerRef.current;
    gRef.x += (ptr.x - gRef.x) * 0.22;
    gRef.y += (ptr.y - gRef.y) * 0.22;

    // Rotation
    const G = 1 - 0.7 * L; // pointer influence scale (reduced during join-drop)
    const pointerRotY = 0.5 * gRef.x * G;
    const idleRot = 0.08 * t;
    const scrollRot = M * Math.PI * 4 * (1 - L); // scroll rotation reduced during join-drop
    const targetRotY = idleRot + scrollRot + pointerRotY;

    // Breathing bob (lerp with L for reduced breathing during join-drop)
    const bobH = lerp(0.015, 0.004, L);
    const bobV = lerp(0.01, 0.003, L);
    const bobZ = lerp(0.008, 0.002, L);
    const breathY = Math.sin(0.8 * t) * bobH;
    const breathX = Math.sin(0.55 * t) * bobV;
    const breathZ = Math.cos(0.65 * t) * bobZ;

    // Pointer-driven tilt
    const pointerTiltX = 0.28 * gRef.y * G;
    const pointerTiltZ = 0.2 * gRef.x * G;
    const targetRotX = 0.12 + 0.03 * Math.sin(M * Math.PI) + pointerTiltX;
    const targetRotZ = 0.08 + 0.03 * Math.sin(M * Math.PI * 2) + pointerTiltZ;

    // Scale
    const Z = B ? 0.6 : 1;

    // Pointer-driven position offset
    const pointerOffX = gRef.x * viewport.width * 0.04;
    const pointerOffY = -gRef.y * viewport.height * 0.04;

    // Mobile vertical offset (pillars section)
    const mobileYOff = (B ? -0.18 : 0) + (B && isPillarsActive ? -0.1 : 0);

    // Base target position
    let en = breathX + pointerOffX; // targetX
    let er = breathY + pointerOffY + mobileYOff; // targetY
    let ei = breathZ; // targetZ
    let ea = 0.2 * Z; // targetScale

    // ─── JoinDrop positioning (L > 0.001) ───
    if (L > 0.001 && C && T && camera) {
      const ndcVec = new THREE.Vector3(
        (T.x / size.width) * 2 - 1,
        -(T.y / size.height) * 2 - 1,
        0.5
      );
      ndcVec.unproject(camera);
      const dir = ndcVec.sub(camera.position).normalize();
      const dist = (0 - camera.position.z) / dir.z;
      const worldTarget = camera.position.clone().add(dir.multiplyScalar(dist));

      const vwRatio = viewport.width / size.width;
      const vhRatio = viewport.height / size.height;
      const pw = C.width * vwRatio;
      const ph = C.height * vhRatio;
      const fitScale = Math.min(
        pw / (2.5 * modelBounds.size.x),
        ph / (2.5 * modelBounds.size.y)
      );

      centerOffsetRef.current.copy(modelBounds.center).multiplyScalar(2.5 * fitScale);
      const wx = worldTarget.x - centerOffsetRef.current.x;
      const wy = worldTarget.y - centerOffsetRef.current.y;
      const wz = 0 - centerOffsetRef.current.z;

      if (B) {
        // Mobile: snap and hold position
        if (!mobileSnapRef.current) {
          mobileSnapRef.current = { x: wx, y: wy, z: wz, scale: fitScale };
        }
        const snap = mobileSnapRef.current;
        en = lerp(en, snap.x, L);
        er = lerp(er, snap.y, L);
        ei = lerp(ei, snap.z, L);
        ea = lerp(ea, snap.scale, L);
      } else {
        en = lerp(en, wx, L);
        er = lerp(er, wy, L);
        ei = lerp(ei, wz, L);
        ea = lerp(ea, fitScale, L);
      }
    }

    // ─── Footer: on mobile, lerp back to breathing-only (original: D>.001&&B) ───
    if (D > 0.001 && B) {
      en = lerp(en, breathX, D);
      er = lerp(er, breathY + mobileYOff, D);
    }

    // Lerp speed: slower when transitioning away from join-drop
    const isLeaving = w === 0 && L > 0.01;
    const lerpSpeed = isLeaving ? 0.08 : 0.035;

    u.x += (en - u.x) * lerpSpeed;
    u.y += (er - u.y) * lerpSpeed;
    u.z += (ei - u.z) * lerpSpeed;
    u.rotX += (targetRotX - u.rotX) * 0.03;
    u.rotY += (targetRotY - u.rotY) * 0.03;
    u.rotZ += (targetRotZ - u.rotZ) * 0.03;
    u.scale += (ea - u.scale) * (isLeaving ? 0.08 : 0.03);

    // Origin offset (vertical shift between pillars→joindrop)
    let originYOff = 0;
    const originOff = originOffsetRef.current ?? 0;
    if (originOff > 0) {
      originYOff = originOff * (viewport.height / size.height) * (1 - L);
    }

    groupRef.current.position.set(u.x, u.y + originYOff, u.z);
    groupRef.current.rotation.set(u.rotX, u.rotY, u.rotZ);
    groupRef.current.scale.setScalar(u.scale);
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} scale={2.5} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

/* ─── Bottle3D — faithful match of original f8 ─── */
interface Bottle3DProps {
  onModelLoaded: () => void;
}

export default function Bottle3D({ onModelLoaded }: Bottle3DProps) {
  const scrollProgressRef = useRef({ current: 0 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const joinDropRectRef = useRef<DOMRect | null>(null);
  const originOffsetRef = useRef(0);
  const [isJoinDropActive, setIsJoinDropActive] = useState(false);
  const [isFooterActive, setIsFooterActive] = useState(false);
  const [isPillarsActive, setIsPillarsActive] = useState(false);

  /* Scroll progress */
  useEffect(() => {
    const update = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current.current =
        docH > 0 ? Math.min(Math.max(window.scrollY / docH, 0), 1) : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* Join-drop placeholder rect tracking */
  useEffect(() => {
    const el = document.getElementById("join-drop-bottle");
    if (!el) return;
    const update = () => {
      joinDropRectRef.current = el.getBoundingClientRect();
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* IntersectionObservers (original f8) */
  useEffect(() => {
    const jd = document.getElementById("join-drop");
    if (!jd) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsJoinDropActive(e.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(jd);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const ft = document.getElementById("footer");
    if (!ft) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsFooterActive(e.isIntersecting),
      { threshold: 0.3 }
    );
    obs.observe(ft);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const pp = document.getElementById("power-pillars-scroll");
    if (!pp) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsPillarsActive(e.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(pp);
    return () => obs.disconnect();
  }, []);

  /* Origin offset — vertical transition between pillars→joinDrop (original f8) */
  useEffect(() => {
    const pillars = document.getElementById("power-pillars-scroll");
    const joinDrop = document.getElementById("join-drop");
    if (!pillars) return;

    const update = () => {
      const vh = window.innerHeight;
      const pillarsBottom = pillars.getBoundingClientRect().bottom;
      let offset = Math.max(0, vh - pillarsBottom);

      if (joinDrop && offset > 0) {
        const jdTop = joinDrop.getBoundingClientRect().top;
        if (jdTop < vh) {
          offset = offset * (1 - Math.min(1, Math.max(0, (vh - jdTop) / vh)));
        }
      }
      originOffsetRef.current = offset;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* Pointer tracking (original f8) */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    let hasPointer = mq.matches;

    const onMqChange = () => {
      hasPointer = mq.matches;
      if (!hasPointer) {
        pointerRef.current.x = 0;
        pointerRef.current.y = 0;
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!hasPointer) return;
      const { innerWidth: w, innerHeight: h } = window;
      if (w && h) {
        pointerRef.current.x = (e.clientX / w) * 2 - 1;
        pointerRef.current.y = (e.clientY / h) * 2 - 1;
      }
    };
    const onBlur = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
    };

    mq.addEventListener("change", onMqChange);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onBlur);
    document.addEventListener("mouseleave", onBlur);

    return () => {
      mq.removeEventListener("change", onMqChange);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("mouseleave", onBlur);
    };
  }, []);

  return (
    <div
      id="bottle-3d-container"
      className="pointer-events-none fixed inset-0 z-40"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", pointerEvents: "none" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} />

        <Suspense fallback={null}>
          <BottleModel
            scrollProgressRef={scrollProgressRef}
            pointerRef={pointerRef}
            joinDropRectRef={joinDropRectRef}
            isJoinDropActive={isJoinDropActive}
            isFooterActive={isFooterActive}
            isPillarsActive={isPillarsActive}
            originOffsetRef={originOffsetRef}
            onModelReady={onModelLoaded}
          />
          <Environment preset="studio" environmentIntensity={0.35} />
        </Suspense>
      </Canvas>
    </div>
  );
}
