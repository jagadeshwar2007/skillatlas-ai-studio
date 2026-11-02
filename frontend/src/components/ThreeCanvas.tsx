"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeCanvasProps {
  topic?: string;
  sceneNumber?: number;
  interactive?: boolean;
}

export function ThreeCanvas({ topic = "How does an AI neural network work?", sceneNumber = 1, interactive = true }: ThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState<number>(30);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 640;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050811");
    scene.fog = new THREE.FogExp2("#050811", 0.05);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x00f2fe, 3, 50);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x818cf8, 2, 50);
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    // Domain Specific Procedural 3D Objects
    const group = new THREE.Group();
    scene.add(group);

    const topicLower = topic.toLowerCase();
    let animUpdate = (time: number) => {};

    if (topicLower.includes("neural") || topicLower.includes("ai") || topicLower.includes("chatgpt")) {
      // 1. NEURAL NETWORK PROCEDURAL 3D
      const layers = [4, 6, 6, 2];
      const nodes: THREE.Mesh[] = [];
      const lines: THREE.Line[] = [];
      const nodePos: THREE.Vector3[][] = [];

      layers.forEach((count, lIdx) => {
        const layerPositions: THREE.Vector3[] = [];
        const x = (lIdx - (layers.length - 1) / 2) * 1.5;
        for (let i = 0; i < count; i++) {
          const y = (i - (count - 1) / 2) * 0.7;
          const z = (Math.random() - 0.5) * 0.4;
          const pos = new THREE.Vector3(x, y, z);
          layerPositions.push(pos);

          const geom = new THREE.SphereGeometry(0.12, 16, 16);
          const mat = new THREE.MeshStandardMaterial({
            color: lIdx === 0 ? 0x38bdf8 : lIdx === layers.length - 1 ? 0x10b981 : 0x00f2fe,
            emissive: 0x00f2fe,
            emissiveIntensity: 0.5,
            roughness: 0.2
          });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.copy(pos);
          group.add(mesh);
          nodes.push(mesh);
        }
        nodePos.push(layerPositions);
      });

      // Connections between adjacent layers
      for (let l = 0; l < nodePos.length - 1; l++) {
        for (const p1 of nodePos[l]) {
          for (const p2 of nodePos[l + 1]) {
            const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
            const lineMat = new THREE.LineBasicMaterial({
              color: 0x00f2fe,
              transparent: true,
              opacity: 0.18
            });
            const line = new THREE.Line(lineGeom, lineMat);
            group.add(line);
            lines.push(line);
          }
        }
      }

      animUpdate = (time) => {
        group.rotation.y = Math.sin(time * 0.5) * 0.25;
        nodes.forEach((n, idx) => {
          const s = 1 + Math.sin(time * 4 + idx * 0.8) * 0.15;
          n.scale.set(s, s, s);
        });
      };

    } else if (topicLower.includes("heart") || topicLower.includes("cardiac")) {
      // 2. HUMAN HEART PROCEDURAL 3D
      const heartGeom = new THREE.SphereGeometry(1.2, 32, 32);
      // Deform sphere into organic cardioid
      const posAttr = heartGeom.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);
        y -= Math.abs(x) * 0.3;
        z *= 0.8;
        posAttr.setXYZ(i, x, y, z);
      }
      heartGeom.computeVertexNormals();

      const heartMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0x991b1b,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.1
      });
      const heartMesh = new THREE.Mesh(heartGeom, heartMat);
      group.add(heartMesh);

      // Blood flow particle stream
      const partCount = 150;
      const partGeom = new THREE.BufferGeometry();
      const pPositions = new Float32Array(partCount * 3);
      for (let i = 0; i < partCount * 3; i += 3) {
        pPositions[i] = (Math.random() - 0.5) * 1.5;
        pPositions[i + 1] = (Math.random() - 0.5) * 2.5;
        pPositions[i + 2] = (Math.random() - 0.5) * 1.5;
      }
      partGeom.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
      const partMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.08, transparent: true, opacity: 0.7 });
      const particles = new THREE.Points(partGeom, partMat);
      group.add(particles);

      animUpdate = (time) => {
        // Systolic beat pulse (double bump: lub-dub)
        const tCycle = (time * 1.3) % 1;
        let pulse = 1;
        if (tCycle < 0.15) {
          pulse = 1 + Math.sin(tCycle / 0.15 * Math.PI) * 0.12;
        } else if (tCycle > 0.25 && tCycle < 0.45) {
          pulse = 1 + Math.sin((tCycle - 0.25) / 0.2 * Math.PI) * 0.08;
        }
        heartMesh.scale.set(pulse, pulse * 1.05, pulse);
        group.rotation.y = time * 0.3;
      };

    } else if (topicLower.includes("search") || topicLower.includes("algorithm")) {
      // 3. BINARY SEARCH PROCEDURAL 3D
      const blockCount = 12;
      const blocks: THREE.Mesh[] = [];
      for (let i = 0; i < blockCount; i++) {
        const height = 0.4 + i * 0.2;
        const bGeom = new THREE.BoxGeometry(0.3, height, 0.3);
        const isTarget = i === 8;
        const isEliminated = i < 6;
        const bMat = new THREE.MeshStandardMaterial({
          color: isTarget ? 0x10b981 : isEliminated ? 0x334155 : 0x38bdf8,
          emissive: isTarget ? 0x10b981 : 0x000000,
          emissiveIntensity: isTarget ? 0.6 : 0,
          roughness: 0.2
        });
        const mesh = new THREE.Mesh(bGeom, bMat);
        mesh.position.set((i - blockCount / 2) * 0.45, height / 2 - 1.0, 0);
        group.add(mesh);
        blocks.push(mesh);
      }

      // Scanner laser beam
      const laserGeom = new THREE.CylinderGeometry(0.04, 0.04, 3.5, 16);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true });
      const laser = new THREE.Mesh(laserGeom, laserMat);
      laser.rotation.z = Math.PI / 2;
      laser.position.set(0, 0.8, 0);
      group.add(laser);

      animUpdate = (time) => {
        laser.position.x = Math.sin(time * 2) * 2.2;
        group.rotation.y = Math.sin(time * 0.3) * 0.2;
      };

    } else if (topicLower.includes("motor") || topicLower.includes("electric")) {
      // 4. ELECTRIC MOTOR PROCEDURAL 3D
      const statorGeom = new THREE.TorusGeometry(1.5, 0.25, 16, 40);
      const statorMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
      const stator = new THREE.Mesh(statorGeom, statorMat);
      group.add(stator);

      // Armature / Rotor
      const rotorGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 24);
      const rotorMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });
      const rotor = new THREE.Mesh(rotorGeom, rotorMat);
      rotor.rotation.x = Math.PI / 2;
      group.add(rotor);

      animUpdate = (time) => {
        rotor.rotation.z += 0.08;
        group.rotation.y = Math.sin(time * 0.4) * 0.3;
      };

    } else {
      // 5. GRAVITY & SPACETIME PROCEDURAL 3D
      const gridGeom = new THREE.PlaneGeometry(5, 5, 25, 25);
      const pos = gridGeom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const dist = Math.sqrt(x * x + y * y);
        pos.setZ(i, -1.8 / (dist * 0.8 + 0.8));
      }
      gridGeom.computeVertexNormals();

      const gridMat = new THREE.MeshStandardMaterial({
        color: 0x818cf8,
        wireframe: true,
        emissive: 0x4338ca,
        emissiveIntensity: 0.3
      });
      const gridMesh = new THREE.Mesh(gridGeom, gridMat);
      gridMesh.rotation.x = -Math.PI / 2.3;
      group.add(gridMesh);

      // Central mass
      const massGeom = new THREE.SphereGeometry(0.4, 32, 32);
      const massMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xbe185d, emissiveIntensity: 0.6 });
      const centralMass = new THREE.Mesh(massGeom, massMat);
      centralMass.position.set(0, -0.6, 0);
      group.add(centralMass);

      // Orbiting satellite
      const satGeom = new THREE.SphereGeometry(0.12, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.8 });
      const sat = new THREE.Mesh(satGeom, satMat);
      group.add(sat);

      animUpdate = (time) => {
        const r = 1.4;
        sat.position.set(Math.cos(time * 2.2) * r, -0.6 + Math.sin(time * 2.2) * 0.1, Math.sin(time * 2.2) * r);
        group.rotation.y = time * 0.2;
      };
    }

    // Animation Loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      animUpdate(elapsedTime);
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container) container.innerHTML = "";
    };
  }, [topic, sceneNumber]);

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-950 rounded-2xl overflow-hidden border border-border">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-cyan-400">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Three.js Engine A • 60 FPS WebGL</span>
      </div>
    </div>
  );
}
