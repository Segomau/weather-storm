import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HomePage({ onNavigate }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Configuración de Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 50);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Variables para interacción
        const mouse = new THREE.Vector2(10000, 10000);
        const particleData = [];
        const energyLines = [];

        // Crear partículas principales
        const createMainParticles = () => {
            const particleCount = 8000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            // Colores rainmap
            const baseColor = new THREE.Color(0x0a0a0c); // rainmap-bg
            const accentColor = new THREE.Color(0x00ffc8); // rainmap-accent
            const accent2Color = new THREE.Color(0x00ff78); // rainmap-accent2

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const x = (Math.random() - 0.5) * 100;
                const y = (Math.random() - 0.5) * 100;

                particleData.push({
                    originalPos: new THREE.Vector3(x, y, (Math.random() - 0.5) * 20),
                    currentPos: new THREE.Vector3(x, y, (Math.random() - 0.5) * 20),
                    velocity: new THREE.Vector3(),
                });

                positions[i3] = x;
                positions[i3 + 1] = y;
                positions[i3 + 2] = particleData[i].originalPos.z;

                // Color base con variación sutil
                const colorVariation = Math.random() * 0.2;
                const particleColor = baseColor.clone().lerp(accentColor, colorVariation * 0.3);
                particleColor.toArray(colors, i3);
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 1.2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true
            });

            const particles = new THREE.Points(geometry, material);
            scene.add(particles);
            return particles;
        };

        // Crear líneas de energía
        const createEnergyLines = () => {
            const lineCount = 20;

            for (let i = 0; i < lineCount; i++) {
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(6);

                const z = (Math.random() - 0.5) * 120 - 60;
                const startX = (Math.random() - 0.5) * 120;
                const startY = (Math.random() - 0.5) * 120;
                const length = Math.random() * 8 + 3;

                positions[0] = startX;
                positions[1] = startY;
                positions[2] = z;
                positions[3] = startX;
                positions[4] = startY - length;
                positions[5] = z;

                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

                const material = new THREE.LineBasicMaterial({
                    color: new THREE.Color(0x00ff78), // rainmap-accent2
                    transparent: true,
                    opacity: 0.3,
                    linewidth: 1
                });

                const line = new THREE.Line(geometry, material);

                line.userData = {
                    speed: Math.random() * 25 + 10,
                    originalZ: z
                };

                energyLines.push(line);
                scene.add(line);
            }
        };

        // Event listeners
        const onWindowResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        // Inicialización
        const particles = createMainParticles();
        createEnergyLines();

        window.addEventListener('resize', onWindowResize);
        window.addEventListener('mousemove', onMouseMove);

        // Animación
        const clock = new THREE.Clock();
        const animate = () => {
            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();

            animationRef.current = requestAnimationFrame(animate);

            // Calcular posición del mouse en 3D
            const mousePos3D = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            mousePos3D.unproject(camera);
            const dir = mousePos3D.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const finalMousePos = camera.position.clone().add(dir.multiplyScalar(distance));

            // Animar partículas
            if (particles && particles.geometry.attributes.position) {
                const positions = particles.geometry.attributes.position.array;
                const colors = particles.geometry.attributes.color.array;
                const highlightColor = new THREE.Color(0x00ffc8); // rainmap-accent
                const secondaryHighlight = new THREE.Color(0x00ff78); // rainmap-accent2

                for (let i = 0; i < particleData.length; i++) {
                    const i3 = i * 3;
                    const data = particleData[i];

                    // Interacción con el mouse
                    const diff = new THREE.Vector3().subVectors(data.currentPos, finalMousePos);
                    const dist = diff.length();
                    let force = 0;

                    if (dist < 25) {
                        force = (1 - (dist / 25)) * 0.08;
                        diff.normalize();
                        data.velocity.add(diff.multiplyScalar(force));
                    }

                    // Fuerza de resorte para volver a posición original
                    const springForce = new THREE.Vector3().subVectors(data.originalPos, data.currentPos).multiplyScalar(0.015);
                    data.velocity.add(springForce);
                    data.velocity.multiplyScalar(0.90); // amortiguación

                    data.currentPos.add(data.velocity);

                    // Movimiento orgánico con seno
                    positions[i3] = data.currentPos.x;
                    positions[i3 + 1] = data.currentPos.y;
                    positions[i3 + 2] = data.currentPos.z + Math.sin(data.originalPos.x * 0.08 + elapsedTime) * 3.0;

                    // Cambio de color basado en la interacción
                    let colorMix = dist < 25 ? (1 - dist / 25) : 0;
                    const targetColor = colorMix > 0.5 ? highlightColor : secondaryHighlight;
                    const color = new THREE.Color(0x0a0a0c).lerp(targetColor, colorMix * 0.8);
                    color.toArray(colors, i3);
                }

                particles.geometry.attributes.position.needsUpdate = true;
                particles.geometry.attributes.color.needsUpdate = true;
            }

            // Animar líneas de energía
            energyLines.forEach(line => {
                line.position.z = (line.position.z + line.userData.speed * delta);
                if (line.position.z > 40) {
                    line.position.z = -120;
                }
            });

            // Rotación sutil de la cámara
            camera.position.x = Math.sin(elapsedTime * 0.1) * 2;
            camera.position.y = Math.cos(elapsedTime * 0.1) * 2;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('mousemove', onMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div className="min-h-screen bg-rainmap-bg relative overflow-hidden">
            {/* Canvas para las partículas - CON FONDO OSCURO Y z-index BAJO */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-0"
            />

            {/* Fondo sólido para mejorar contraste del efecto de vidrio */}
            <div className="absolute inset-0 bg-rainmap-bg/70 z-0" />

            {/* Contenido principal */}
            <div className="relative z-10 w-full h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-3xl mx-auto fade-in">
                    {/* Hero Section con efecto de vidrio IDÉNTICO al InfoPopup */}
                    <div className="bg-rainmap-surface backdrop-blur-xl border border-rainmap-glass-border rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.25)] relative">
                        {/* Logo/Title */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-rainmap-contrast mb-6 text-shadow-glow">
                            RainMap
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-rainmap-muted max-w-2xl mx-auto leading-relaxed">
                            Plataforma de monitoreo meteorológico en tiempo real.
                            Seguimiento de precipitaciones y tormentas con tecnología avanzada.
                        </p>

                        {/* Navigation Buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                            <button
                                className="flex-1 p-4 rounded-xl bg-rainmap-accent/20 border border-rainmap-accent/40 text-rainmap-contrast shadow-[0_0_20px_rgba(0,255,200,0.3)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_0_30px_rgba(0,255,200,0.5)] active:translate-y-0 w-full group"
                                onClick={() => onNavigate("map")}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-3 h-3 rounded-full border border-rainmap-accent bg-rainmap-accent/30 group-hover:bg-rainmap-accent/50 transition-colors" aria-hidden />
                                    <span className="font-semibold text-lg">Mapa de Lluvia</span>
                                </div>
                            </button>

                            <button
                                className="flex-1 p-4 rounded-xl bg-rainmap-accent2/20 border border-rainmap-accent2/40 text-rainmap-contrast shadow-[0_0_20px_rgba(0,255,120,0.3)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_0_30px_rgba(0,255,120,0.5)] active:translate-y-0 w-full group"
                                onClick={() => onNavigate("dashboard")}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-3 h-3 rounded-full border border-rainmap-accent2 bg-rainmap-accent2/30 group-hover:bg-rainmap-accent2/50 transition-colors" aria-hidden />
                                    <span className="font-semibold text-lg">Tormentas</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Feature Highlights con el MISMO efecto de vidrio */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
                        <div className="bg-rainmap-surface backdrop-blur-xl border border-rainmap-glass-border rounded-2xl p-4 text-rainmap-contrast transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,200,0.1)]">
                            <h3 className="font-semibold text-rainmap-accent mb-2">Tiempo Real</h3>
                            <p className="text-sm text-rainmap-muted">Datos meteorológicos actualizados cada 5 minutos</p>
                        </div>

                        <div className="bg-rainmap-surface backdrop-blur-xl border border-rainmap-glass-border rounded-2xl p-4 text-rainmap-contrast transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,120,0.1)]">
                            <h3 className="font-semibold text-rainmap-accent2 mb-2">Precisión</h3>
                            <p className="text-sm text-rainmap-muted">Información detallada por ubicación</p>
                        </div>

                        <div className="bg-rainmap-surface backdrop-blur-xl border border-rainmap-glass-border rounded-2xl p-4 text-rainmap-contrast transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(32,201,183,0.1)]">
                            <h3 className="font-semibold text-rainmap-mid mb-2">Alertas</h3>
                            <p className="text-sm text-rainmap-muted">Notificaciones inmediatas de tormentas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos CSS */}
            <style jsx>{`
        .text-shadow-glow {
          text-shadow: 0 0 15px rgba(0, 255, 200, 0.3), 0 0 30px rgba(0, 255, 120, 0.2);
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .fade-in {
          animation: fadeIn 1.5s ease-out 0.5s forwards;
          opacity: 0;
        }
      `}</style>
        </div>
    );
}