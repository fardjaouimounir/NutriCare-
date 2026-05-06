import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshTransmissionMaterial, Environment } from '@react-three/drei';

function GlassOrb({ position, scale, color, speed = 1, floatIntensity = 1 }) {
  const ref = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if(ref.current) {
        ref.current.position.y += Math.sin(t * speed) * 0.005;
        ref.current.rotation.x += 0.01 * speed;
        ref.current.rotation.y += 0.01 * speed;
    }
  });

  return (
    <Float floatIntensity={floatIntensity} speed={speed} rotationIntensity={1}>
      <Sphere ref={ref} position={position} scale={scale} args={[1, 64, 64]}>
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          roughness={0.1}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color={color}
        />
      </Sphere>
    </Float>
  );
}

export const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#E8467A" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C084FC" />
        
        {/* Main large orb */}
        <GlassOrb position={[3, 1, 0]} scale={2.5} color="#ffb6c1" speed={0.5} floatIntensity={1.5} />
        {/* Secondary orb */}
        <GlassOrb position={[-3, -2, -3]} scale={1.8} color="#e6a4ff" speed={0.8} floatIntensity={2} />
        {/* Small detail orb */}
        <GlassOrb position={[-1, 3, -1]} scale={1} color="#ffffff" speed={1.2} floatIntensity={1.2} />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
