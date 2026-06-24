import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';



interface BurgerModelProps {
    scrollFraction: number;
    mouse: { x: number; y: number };
}

const BurgerModel: React.FC<BurgerModelProps> = ({ scrollFraction, mouse }) => {
    const groupRef = useRef<THREE.Group>(null);
    const topBunRef = useRef<THREE.Group>(null);
    const tomato1Ref = useRef<THREE.Mesh>(null);
    const tomato2Ref = useRef<THREE.Mesh>(null);
    const cheeseRef = useRef<THREE.Mesh>(null);
    const pattyRef = useRef<THREE.Mesh>(null);
    const lettuceRef = useRef<THREE.Mesh>(null);
    const bottomBunRef = useRef<THREE.Group>(null);
    const horseshoeRef = useRef<THREE.Mesh>(null);
    const particlesRef = useRef<THREE.Points>(null);

    // 1. Materials Configuration
    const bunMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: 0xD29050, // Rich brioche bun color
        roughness: 0.3,
        metalness: 0.05,
        clearcoat: 0.7,
        clearcoatRoughness: 0.1
    }), []);

    const pattyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: 0x5c321a, // Warm grilled brown beef patty
        roughness: 0.85,
        metalness: 0.1,
        clearcoat: 0.1
    }), []);

    const cheeseMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: 0xFFBF00, // Cheddar yellow
        roughness: 0.25,
        metalness: 0.05,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
    }), []);

    const lettuceMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: 0x3A5F0B, // Leaf green
        roughness: 0.9,
        metalness: 0.0
    }), []);

    const hsMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: 0x484B50, // Realistic dark forged steel/iron
        metalness: 0.85,
        roughness: 0.45,
        clearcoat: 0.2,
        clearcoatRoughness: 0.3
    }), []);

    // 2. Tomato Slice Canvas Texture
    const tomatoTexture = useMemo(() => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = 256;
        tempCanvas.height = 256;
        const ctx = tempCanvas.getContext("2d");
        if (!ctx) return new THREE.Texture();
        
        ctx.fillStyle = "#FF2400";
        ctx.beginPath();
        ctx.arc(128, 128, 128, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#D32F2F";
        const numPockets = 4;
        for (let i = 0; i < numPockets; i++) {
            const startAngle = (i / numPockets) * Math.PI * 2 + 0.15;
            const endAngle = ((i + 1) / numPockets) * Math.PI * 2 - 0.15;
            
            ctx.beginPath();
            ctx.moveTo(128, 128);
            ctx.arc(128, 128, 105, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = "#FFD700";
            const seedAngle = startAngle + (endAngle - startAngle) / 2;
            const seedX1 = 128 + Math.cos(seedAngle - 0.1) * 75;
            const seedY1 = 128 + Math.sin(seedAngle - 0.1) * 75;
            const seedX2 = 128 + Math.cos(seedAngle + 0.1) * 75;
            const seedY2 = 128 + Math.sin(seedAngle + 0.1) * 75;
            
            ctx.beginPath();
            ctx.arc(seedX1, seedY1, 6, 0, Math.PI * 2);
            ctx.arc(seedX2, seedY2, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = "#FFA07A";
        ctx.beginPath();
        ctx.arc(128, 128, 30, 0, Math.PI * 2);
        ctx.fill();
        
        const texture = new THREE.CanvasTexture(tempCanvas);
        texture.needsUpdate = true;
        return texture;
    }, []);

    const tomatoMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: 0xFF2400,
        map: tomatoTexture,
        roughness: 0.15,
        metalness: 0.05,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1
    }), [tomatoTexture]);

    // 3. Sesame seeds points for Top Bun
    const seedPositions = useMemo(() => {
        const count = 60;
        const positions: Array<[number, number, number, number, number, number]> = [];
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 0.6 + 0.4); 
            const R = 1.305;
            
            const x = R * Math.cos(theta) * Math.sin(phi);
            const y = R * Math.cos(phi); 
            const z = R * Math.sin(theta) * Math.sin(phi);
            positions.push([x, y, z, theta, phi, R]);
        }
        return positions;
    }, []);

    // 4. Beef Patty Noise Geometry Setup
    const pattyGeometry = useMemo(() => {
        const geo = new THREE.CylinderGeometry(1.25, 1.25, 0.35, 64, 4);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const px = pos.getX(i);
            const py = pos.getY(i);
            const pz = pos.getZ(i);
            
            const angle = Math.atan2(pz, px);
            const dist = Math.sqrt(px * px + pz * pz);
            if (dist > 1.0) {
                const noise = (Math.random() - 0.5) * 0.08;
                pos.setX(i, px + Math.cos(angle) * noise);
                pos.setZ(i, pz + Math.sin(angle) * noise);
            }
            pos.setY(i, py + (Math.random() - 0.5) * 0.03);
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    // 5. Forged Iron Horseshoe 3D Extruded Geometry
    const hsGeometry = useMemo(() => {
        const hsShape = new THREE.Shape();
        const outerRadius = 2.3;
        const innerRadius = 1.7;
        const hsPoints = 40;
        const startAngle = 1.32 * Math.PI;
        const endAngle = 0.68 * Math.PI;
        
        // Draw outer curved boundary
        for (let i = 0; i <= hsPoints; i++) {
            const t = i / hsPoints;
            const angle = startAngle + t * (2 * Math.PI - (startAngle - endAngle));
            const x = Math.cos(angle) * outerRadius;
            const y = Math.sin(angle) * outerRadius;
            if (i === 0) {
                hsShape.moveTo(x, y);
            } else {
                hsShape.lineTo(x, y);
            }
        }
        
        // Flat rounded heel tip
        hsShape.lineTo(Math.cos(endAngle) * innerRadius, Math.sin(endAngle) * innerRadius);
        
        // Draw inner curved boundary back
        for (let i = hsPoints; i >= 0; i--) {
            const t = i / hsPoints;
            const angle = startAngle + t * (2 * Math.PI - (startAngle - endAngle));
            hsShape.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
        }
        
        hsShape.closePath();

        // Add 6 square nail holes along the horseshoe arc (leaving front solid)
        const holeSize = 0.07;
        const r_mid = (outerRadius + innerRadius) / 2;
        const holePositions = [0.12, 0.25, 0.38, 0.62, 0.75, 0.88];
        
        holePositions.forEach((t) => {
            const angle = startAngle + t * (2 * Math.PI - (startAngle - endAngle));
            const hx = Math.cos(angle) * r_mid;
            const hy = Math.sin(angle) * r_mid;
            
            const holePath = new THREE.Path();
            holePath.moveTo(hx - holeSize, hy - holeSize);
            holePath.lineTo(hx + holeSize, hy - holeSize);
            holePath.lineTo(hx + holeSize, hy + holeSize);
            holePath.lineTo(hx - holeSize, hy + holeSize);
            holePath.closePath();
            
            hsShape.holes.push(holePath);
        });

        const extrudeSettings = {
            depth: 0.22,
            bevelEnabled: true,
            bevelSegments: 5,
            steps: 1,
            bevelSize: 0.035,
            bevelThickness: 0.04
        };

        const geo = new THREE.ExtrudeGeometry(hsShape, extrudeSettings);
        geo.center();
        return geo;
    }, []);

    // 5b. Organic Lettuce Wavy Geometry
    const lettuceGeometry = useMemo(() => {
        const geo = new THREE.CylinderGeometry(1.35, 1.4, 0.05, 64, 4);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const px = pos.getX(i);
            const py = pos.getY(i);
            const pz = pos.getZ(i);
            
            const angle = Math.atan2(pz, px);
            const dist = Math.sqrt(px * px + pz * pz);
            
            // Wavy lettuce edge
            if (dist > 0.4) {
                const wave = Math.sin(angle * 8) * 0.12 + Math.cos(angle * 3) * 0.06;
                pos.setY(i, py + wave);
            }
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    // 5c. Melted Draped Cheese Geometry
    const cheeseGeometry = useMemo(() => {
        const geo = new THREE.BoxGeometry(1.65, 0.04, 1.65, 12, 1, 12);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const px = pos.getX(i);
            const py = pos.getY(i);
            const pz = pos.getZ(i);
            
            const dist = Math.sqrt(px * px + pz * pz);
            
            // Corner draping
            if (dist > 0.5) {
                const drape = Math.pow(dist - 0.5, 2.2) * 0.4;
                pos.setY(i, py - drape);
            }
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    // 6. Sparks Particles setup
    const particleCount = 40;
    const [particlePositions, particleVelocities] = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            positions[idx] = (Math.random() - 0.5) * 6; // X
            positions[idx + 1] = (Math.random() - 0.5) * 6; // Y
            positions[idx + 2] = (Math.random() - 0.5) * 6; // Z
            velocities[idx + 1] = 0.01 + Math.random() * 0.03; // rise speed
        }
        return [positions, velocities];
    }, []);

    // 7. Animation Loop Hook
    useFrame((state) => {
        if (!groupRef.current) return;

        // Auto rotation + mouse cursor hover tilt
        const targetRotY = state.clock.getElapsedTime() * 0.1 + mouse.x * 0.5;
        const targetRotX = mouse.y * 0.4;
        
        groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
        groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;

        // Horseshoe slow rotation and hover oscillation
        if (horseshoeRef.current) {
            horseshoeRef.current.rotation.z -= 0.006;
            horseshoeRef.current.position.y = 0.5 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15;
            horseshoeRef.current.rotation.y = 0.3 + mouse.x * 0.4;
            horseshoeRef.current.rotation.x = Math.PI / 2.2 + mouse.y * 0.3;
        }

        // Animate floating spark particles
        if (particlesRef.current) {
            const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
            const positions = posAttr.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                const idx = i * 3 + 1; // Y coordinate
                positions[idx] += particleVelocities[idx];
                if (positions[idx] > 3) {
                    positions[idx] = -3; // Loop back to bottom
                }
            }
            posAttr.needsUpdate = true;
            particlesRef.current.rotation.y -= 0.001;
        }

        // Burger layers separation logic on scroll (packed at bottom, exploded at top/initial)
        // At scrollFraction = 0 (top of page), separation is 1.0 (fully exploded)
        // At scrollFraction = 0.3, it collapses together completely (separation = 0.1)
        const targetSeparation = Math.max(0.1, 1.0 - scrollFraction * 3.0);
        
        if (topBunRef.current) topBunRef.current.position.y = targetSeparation * 1.3;
        if (tomato1Ref.current) tomato1Ref.current.position.y = targetSeparation * 0.8;
        if (tomato2Ref.current) tomato2Ref.current.position.y = targetSeparation * 0.8;
        if (cheeseRef.current) cheeseRef.current.position.y = targetSeparation * 0.35;
        if (pattyRef.current) pattyRef.current.position.y = -targetSeparation * 0.1;
        if (lettuceRef.current) lettuceRef.current.position.y = -targetSeparation * 0.55;
        if (bottomBunRef.current) bottomBunRef.current.position.y = -targetSeparation * 1.0;

        // Parallax height shift
        groupRef.current.position.y = 0.5 - scrollFraction * 1.2;
    });

    return (
        <group ref={groupRef} scale={[1.3, 1.3, 1.3]}>
            {/* Top Bun with Scattered Seeds and Flat Crumb Base */}
            <group ref={topBunRef} scale={[1.0, 0.65, 1.0]}>
                {/* Golden Dome Crust */}
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <primitive object={bunMaterial} attach="material" />
                    {seedPositions.map((pos, idx) => (
                        <mesh key={idx} position={[pos[0], pos[1], pos[2]]} rotation={[pos[4], pos[3], 0]}>
                            <sphereGeometry args={[0.02, 8, 8]} />
                            <primitive object={new THREE.MeshStandardMaterial({ color: 0xFDF5E6, roughness: 0.5 })} attach="material" />
                        </mesh>
                    ))}
                </mesh>
                {/* Flat bread cut face */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
                    <circleGeometry args={[1.3, 32]} />
                    <primitive object={new THREE.MeshStandardMaterial({ color: 0xFDF5E6, roughness: 0.7, side: THREE.DoubleSide })} attach="material" />
                </mesh>
            </group>

            {/* Tomato Slice 1 (tilted to show canvas texture) */}
            <mesh ref={tomato1Ref} position={[-0.45, 0, 0]} rotation={[0.15, 0.1, -0.1]} castShadow receiveShadow>
                <cylinderGeometry args={[0.55, 0.55, 0.12, 32]} />
                <primitive object={tomatoMaterial} attach="material" />
            </mesh>

            {/* Tomato Slice 2 (tilted to show canvas texture) */}
            <mesh ref={tomato2Ref} position={[0.45, 0, 0]} rotation={[0.12, -0.1, 0.15]} castShadow receiveShadow>
                <cylinderGeometry args={[0.55, 0.55, 0.12, 32]} />
                <primitive object={tomatoMaterial} attach="material" />
            </mesh>

            {/* Cheddar Cheese Slice (draped over patty) */}
            <mesh ref={cheeseRef} geometry={cheeseGeometry} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
                <primitive object={cheeseMaterial} attach="material" />
            </mesh>

            {/* Grilled Beef Patty */}
            <mesh ref={pattyRef} geometry={pattyGeometry} castShadow receiveShadow>
                <primitive object={pattyMaterial} attach="material" />
            </mesh>

            {/* Organic Lettuce Sheet (wavy edges) */}
            <mesh ref={lettuceRef} geometry={lettuceGeometry} castShadow receiveShadow>
                <primitive object={lettuceMaterial} attach="material" />
            </mesh>

            {/* Bottom Bun with Flat Sliced Crumb Face */}
            <group ref={bottomBunRef}>
                {/* Bun Bottom Crust */}
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[1.3, 1.2, 0.35, 32]} />
                    <primitive object={bunMaterial} attach="material" />
                </mesh>
                {/* Flat bread cut face */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.176, 0]} receiveShadow>
                    <circleGeometry args={[1.3, 32]} />
                    <primitive object={new THREE.MeshStandardMaterial({ color: 0xFDF5E6, roughness: 0.7, side: THREE.DoubleSide })} attach="material" />
                </mesh>
            </group>

            {/* Tilted Rotating Golden Horseshoe */}
            <mesh ref={horseshoeRef} geometry={hsGeometry} rotation={[Math.PI / 2.2, 0.3, 0.4]} position={[0, 0.5, 0]} castShadow>
                <primitive object={hsMaterial} attach="material" />
            </mesh>

            {/* Heat Fire Spark Particles */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[particlePositions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color={0xe25822} // grill orange fire embers
                    size={0.07}
                    transparent
                    opacity={0.8}
                />
            </points>
        </group>
    );
};

interface BurgerSceneProps {
    scrollFraction: number;
    mouse: { x: number; y: number };
}

const BurgerScene: React.FC<BurgerSceneProps> = ({ scrollFraction, mouse }) => {
    return (
        <div style={{ width: '100%', height: '100%', outline: 'none', position: 'relative' }}>
            <Canvas
                shadows
                camera={{ position: [0, 0.6, 8.5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 5]} intensity={1.4} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
                <directionalLight position={[-5, -5, 2]} intensity={0.9} color="#e25822" />
                
                <BurgerModel scrollFraction={scrollFraction} mouse={mouse} />
            </Canvas>
        </div>
    );
};

export default BurgerScene;
