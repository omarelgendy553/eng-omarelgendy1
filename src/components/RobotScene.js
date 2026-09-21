import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useLanguage } from "../context/LanguageContext";

// ---- Tunable palette -------------------------------------------------
const GREEN = "#123524"; // dark green shell
const GREEN_LIT = "#1c5039";
const BLUE = "#1a3350"; // matte blue joints/accents
const BLUE_LIT = "#4a7bb0";
const CORE = "#2d8f63"; // glowing core seen once the chest opens

// Smoothstep-style ease used to shape scroll progress into motion
const ease = (t) => t * t * (3 - 2 * t);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** Reads scroll position of the wrapper section and turns it into 0..1 progress */
function useScrollProgress(wrapperRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(clamp01(total > 0 ? scrolled / total : 0));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [wrapperRef]);

  return progress;
}

function RobotRig({ progressRef }) {
  const group = useRef();
  const chestTop = useRef();
  const chestBottom = useRef();
  const headRef = useRef();
  const armL = useRef();
  const armR = useRef();
  const legL = useRef();
  const legR = useRef();
  const coreRef = useRef();
  const { camera } = useFrame ? { camera: null } : {};

  useFrame((state) => {
    const p = progressRef.current; // 0 -> 1 across the hero scroll
    const open = ease(clamp01((p - 0.15) / 0.55)); // opening happens mid-scroll
    const dive = ease(clamp01((p - 0.6) / 0.4)); // camera dives in during the tail

    // Idle float/rotation before opening begins
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -0.3 + p * 0.6, 0.08);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -p * 0.4, 0.08);
    }

    // Chest halves separate vertically to reveal the glowing core
    if (chestTop.current) chestTop.current.position.y = THREE.MathUtils.lerp(0.35, 1.35, open);
    if (chestBottom.current) chestBottom.current.position.y = THREE.MathUtils.lerp(-0.35, -1.35, open);

    // Head lifts slightly, arms + legs swing outward like a blooming flower
    if (headRef.current) headRef.current.position.y = THREE.MathUtils.lerp(1.85, 2.35, open);
    if (armL.current) armL.current.rotation.z = THREE.MathUtils.lerp(0.35, 1.4, open);
    if (armR.current) armR.current.rotation.z = THREE.MathUtils.lerp(-0.35, -1.4, open);
    if (legL.current) legL.current.rotation.z = THREE.MathUtils.lerp(0.08, 0.5, open);
    if (legR.current) legR.current.rotation.z = THREE.MathUtils.lerp(-0.08, -0.5, open);

    // Glowing core pulses and grows as we approach it
    if (coreRef.current) {
      const s = THREE.MathUtils.lerp(0.4, 2.6, dive);
      coreRef.current.scale.setScalar(s);
      coreRef.current.material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
    }

    // Camera starts outside the robot, pushes forward and "enters" the core
    const cam = state.camera;
    const startZ = 6.5;
    const endZ = -1.2; // ends up past the chest cavity, looking back out
    cam.position.z = THREE.MathUtils.lerp(startZ, endZ, dive);
    cam.position.y = THREE.MathUtils.lerp(0.4, 0.2, dive);
    cam.fov = THREE.MathUtils.lerp(45, 70, dive);
    cam.updateProjectionMatrix();
    cam.lookAt(0, 0.4, 0);
  });

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* HEAD */}
      <group ref={headRef} position={[0, 1.85, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.7, 0.8]} />
          <meshStandardMaterial color={GREEN} metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.02, 0.41]}>
          <boxGeometry args={[0.55, 0.18, 0.05]} />
          <meshStandardMaterial color={BLUE_LIT} emissive={BLUE_LIT} emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
          <meshStandardMaterial color={BLUE} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color={CORE} emissive={CORE} emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* NECK */}
      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.22, 12]} />
        <meshStandardMaterial color={BLUE} metalness={0.75} roughness={0.3} />
      </mesh>

      {/* CHEST — TOP HALF (opens upward) */}
      <mesh ref={chestTop} position={[0, 0.35, 0]}>
        <boxGeometry args={[1.15, 0.75, 0.7]} />
        <meshStandardMaterial color={GREEN_LIT} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* CHEST — BOTTOM HALF (opens downward) */}
      <mesh ref={chestBottom} position={[0, -0.35, 0]}>
        <boxGeometry args={[1.15, 0.75, 0.7]} />
        <meshStandardMaterial color={GREEN} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* GLOWING CORE revealed inside the chest cavity */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color={CORE} emissive={CORE} emissiveIntensity={1.5} roughness={0.2} />
      </mesh>

      {/* ARMS */}
      <group ref={armL} position={[-0.75, 0.55, 0]}>
        <mesh position={[-0.25, -0.35, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.7, 6, 12]} />
          <meshStandardMaterial color={BLUE} metalness={0.7} roughness={0.35} />
        </mesh>
      </group>
      <group ref={armR} position={[0.75, 0.55, 0]}>
        <mesh position={[0.25, -0.35, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.7, 6, 12]} />
          <meshStandardMaterial color={BLUE} metalness={0.7} roughness={0.35} />
        </mesh>
      </group>

      {/* LEGS */}
      <group ref={legL} position={[-0.32, -0.75, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.16, 0.75, 6, 12]} />
          <meshStandardMaterial color={GREEN} metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
      <group ref={legR} position={[0.32, -0.75, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.16, 0.75, 6, 12]} />
          <meshStandardMaterial color={GREEN} metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color={BLUE_LIT} castShadow />
      <pointLight position={[-3, -1, 2]} intensity={0.6} color={CORE} />
      <Sparkles count={40} scale={6} size={2} speed={0.3} color={BLUE_LIT} />
    </>
  );
}

export default function RobotScene() {
  const wrapperRef = useRef();
  const progress = useScrollProgress(wrapperRef);
  const progressRef = useRef(0);
  progressRef.current = progress;
  const { t } = useLanguage();

  // Fade the 3D canvas out and let real DOM content take over once we've
  // fully "entered" the robot, so screen readers / SEO / interaction all
  // work normally past the hero.
  const canvasOpacity = 1 - ease(clamp01((progress - 0.92) / 0.08));

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "300vh" }}>
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-void"
        style={{ opacity: canvasOpacity, pointerEvents: canvasOpacity < 0.05 ? "none" : "auto" }}
      >
        <Canvas shadows camera={{ position: [0, 0.4, 6.5], fov: 45 }}>
          <color attach="background" args={["#050706"]} />
          <fog attach="fog" args={["#050706", 4, 12]} />
          <SceneLighting />
          <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
            <RobotRig progressRef={progressRef} />
          </Float>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
            <circleGeometry args={[5, 48]} />
            <MeshDistortMaterial color="#0a2018" distort={0.15} speed={1} metalness={0.6} roughness={0.6} />
          </mesh>
          <Environment preset="city" />
        </Canvas>

        {/* Overlaid hero copy, fades out as the robot opens */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: 1 - ease(clamp01(progress / 0.5)) }}
        >
          <p className="mb-3 text-xs md:text-sm tracking-wide text-steel-400 font-body uppercase">
            {t.hero.eyebrow}
          </p>
          <h1 className="font-display text-4xl md:text-7xl font-bold text-white mb-4">
            {t.hero.name}
          </h1>
          <p className="max-w-xl text-base md:text-lg text-gray-300 font-body">{t.hero.tagline}</p>
          <div className="mt-10 flex flex-col items-center gap-2 animate-float">
            <span className="text-sm text-steel-400">{t.hero.scrollHint}</span>
            <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
              <rect x="1" y="1" width="18" height="26" rx="9" stroke="#4a7bb0" strokeWidth="1.5" />
              <circle cx="10" cy="8" r="2.5" fill="#2d8f63" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
