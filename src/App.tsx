import React, { useState, useEffect, useRef } from 'react';
import BurgerScene from './components/BurgerScene';
import { Flame, ShoppingCart, Info, MapPin, Clock, Phone, ArrowRight, CheckCircle2, Award, MousePointer } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PromoItem {
    title: string;
    desc: string;
    price: string;
    tag: string;
    image: string;
}

const promoData: Record<string, PromoItem[]> = {
    combos: [
        { title: "Combo Brutal", desc: "1 Hamburguesa Brutal + Papas Fritas + Gaseosa fría.", price: "$23.900 COP", tag: "Fijo", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop" },
        { title: "Combo Pareja Brutal", desc: "2 Hamburguesas Brutales + 2 Porciones de Papas + Gaseosa 1.5L.", price: "$44.900 COP", tag: "Recomendado", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop" },
        { title: "Combo Doble Vaquera", desc: "1 Hamburguesa Doble Vaquera + Papas Fritas + Gaseosa fría.", price: "$28.900 COP", tag: "Fijo", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=400&auto=format&fit=crop" }
    ],
    lunes: [
        { title: "Lunes de Brutales", desc: "Hamburguesa Brutal individual con 15% de descuento directo.", price: "$16.900 COP", tag: "Lunes a Miércoles", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop" },
        { title: "Combo Amigos 3x2", desc: "Pagas 2 Hamburguesas Brutales y te llevas 3. Sabor monumental para compartir.", price: "$39.800 COP", tag: "Ahorro Brutal", image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=400&auto=format&fit=crop" }
    ],
    jueves: [
        { title: "Doble Carne Fest", desc: "Tres Hamburguesas Doble Carne por un precio insuperable de fin de semana.", price: "$58.000 COP", tag: "Jueves a Sábado", image: "https://images.unsplash.com/photo-1549611016-3a70d82b5040?q=80&w=400&auto=format&fit=crop" },
        { title: "Salchipapa Combo", desc: "1 Salchipapa Monumental + Gaseosa personal fría.", price: "$19.900 COP", tag: "Especial", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=400&auto=format&fit=crop" }
    ],
    domingo: [
        { title: "Combo Familiar", desc: "4 Hamburguesas Brutales + 4 Porciones de Papas + Gaseosa 1.5L.", price: "$79.900 COP", tag: "Domingo Familiar", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=400&auto=format&fit=crop" },
        { title: "Salchipapa Familiar", desc: "Salchipapa gigante con tocineta, plátano maduro y queso para compartir.", price: "$34.900 COP", tag: "Popular", image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?q=80&w=400&auto=format&fit=crop" }
    ]
};

const menuItems = [
    {
        title: "La Hamburguesa Brutal",
        desc: "Carne seleccionada a la parrilla, queso cheddar derretido, tocineta crujiente, piña calada, plátano maduro frito y papas ripio crujientes.",
        price: "$19.900 COP",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop",
        badge: "Más Pedida"
    },
    {
        title: "Doble Vaquera Extreme",
        desc: "Doble carne de res de 150g a la parrilla, doble queso cheddar fundido desbordante, aros de cebolla crocantes y salsa BBQ ahumada de la casa.",
        price: "$24.900 COP",
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=400&auto=format&fit=crop"
    },
    {
        title: "Salchipapa Monumental",
        desc: "Cama generosa de papas fritas, salchicha premium seleccionada, queso mozzarella fundido desbordante, tocineta y salsa tártara.",
        price: "$18.900 COP",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=400&auto=format&fit=crop"
    },
    {
        title: "La Vaquera Sencilla",
        desc: "Carne de res de 150g, queso cheddar fundido, lechuga fresca, rodajas de tomate, cebolla caramelizada y salsa BBQ ahumada.",
        price: "$15.900 COP",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop"
    },
    {
        title: "Porción de Papas Vaqueras",
        desc: "Papas fritas en casco doradas y crujientes con queso cheddar fundido y trocitos de tocineta tostada por encima.",
        price: "$9.900 COP",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=400&auto=format&fit=crop"
    }
];

const App: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrollFraction, setScrollFraction] = useState(0);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState<'combos' | 'lunes' | 'jueves' | 'domingo'>('combos');

    const mainRef = useRef<HTMLDivElement>(null);
    const promosGridRef = useRef<HTMLDivElement>(null);

    // Track scroll fractions
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            // The burger opens/assembles completely within the first 100vh of scroll (First Panel transition)
            const firstStepHeight = window.innerHeight;
            const fraction = firstStepHeight > 0 ? Math.min(scrollTop / firstStepHeight, 1) : 0;
            setScrollFraction(fraction);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mouse coordinates tracker
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouse({
                x: (e.clientX / window.innerWidth) - 0.5,
                y: (e.clientY / window.innerHeight) - 0.5
            });

            // GSAP cursor tracker
            const dot = document.querySelector('.custom-cursor-dot');
            const ring = document.querySelector('.custom-cursor-ring');
            if (dot && ring) {
                gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.05, overwrite: "auto" });
                gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.25, overwrite: "auto" });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Custom cursor hover triggers
    useEffect(() => {
        const dot = document.querySelector('.custom-cursor-dot');
        const ring = document.querySelector('.custom-cursor-ring');

        const handleMouseEnter = () => {
            dot?.classList.add('cursor-hover');
            ring?.classList.add('cursor-hover');
        };
        const handleMouseLeave = () => {
            dot?.classList.remove('cursor-hover');
            ring?.classList.remove('cursor-hover');
        };

        const attachCursorHovers = () => {
            const hoverables = document.querySelectorAll(
                'a, button, .promo-card, .menu-item-card, .ingredient-card, .day-tab'
            );
            hoverables.forEach(target => {
                target.addEventListener('mouseenter', handleMouseEnter);
                target.addEventListener('mouseleave', handleMouseLeave);
            });
        };

        const timer = setTimeout(attachCursorHovers, 600);
        return () => clearTimeout(timer);
    }, [scrollFraction, activeTab]);

    // Handle Promo Tab change animations
    const handleTabChange = (tab: 'combos' | 'lunes' | 'jueves' | 'domingo') => {
        if (!promosGridRef.current) return;
        gsap.to(promosGridRef.current, {
            opacity: 0,
            y: 15,
            duration: 0.2,
            onComplete: () => {
                setActiveTab(tab);
                gsap.to(promosGridRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
    };

    // GSAP ScrollTrigger Background Color Transition & 3D Card Tilt
    useEffect(() => {
        if (!mainRef.current) return;

        const ctx = gsap.context(() => {
            const panels = gsap.utils.toArray('.panel') as HTMLElement[];

            // Configure initial 3D transform origin for first 2 panels
            panels.forEach((panel, i) => {
                gsap.set(panel, {
                    transformOrigin: "50% 50% -50vh",
                    backfaceVisibility: "hidden",
                    z: 0
                });
                if (i > 0) {
                    gsap.set(panel, { rotationX: 90, opacity: 0 });
                }
            });

            // Master Pinned Scroll Timeline for Hero to Historia transition
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.panels-container',
                    start: 'top top',
                    end: '+=100%', // Exactly 1 full screen scroll transition
                    scrub: 1.2,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // Rotate Panel 1 out and Panel 2 in, and blend background color smoothly
            tl.to(panels[0], {
                rotationX: -90,
                opacity: 0,
                ease: 'none'
            }, 0)
            .to(panels[1], {
                rotationX: 0,
                opacity: 1,
                ease: 'none'
            }, 0)
            .to('.panels-container', {
                backgroundColor: '#3b1709', // Deep warm brown background for history
                ease: 'none'
            }, 0)
            .from('.history-text-side', { opacity: 0, y: 40, duration: 0.5 }, 0.3)
            .from('.history-visual-side', { opacity: 0, scale: 0.95, duration: 0.5 }, 0.3);

            // Transition background color from charcoal black to deep ember grill copper (explicit fromTo to avoid transparent background capture)
            gsap.fromTo(document.body, 
                { backgroundColor: '#1b0c06', color: '#f7ede8' },
                {
                    backgroundColor: '#4a1804', // Glowing amber
                    color: '#f7ede8',
                    scrollTrigger: {
                        trigger: '#ingredientes',
                        start: 'top 60%',
                        end: 'bottom 10%',
                        toggleActions: 'play reverse play reverse'
                    }
                }
            );

            // 3D Card Tilt effect
            const cards = document.querySelectorAll('.promo-card, .menu-item-card, .ingredient-card');
            cards.forEach(card => {
                const onMouseMove = (e: Event) => {
                    const me = e as MouseEvent;
                    const rect = card.getBoundingClientRect();
                    const x = me.clientX - rect.left;
                    const y = me.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((centerY - y) / centerY) * 12;
                    const rotateY = ((x - centerX) / centerX) * 12;

                    gsap.to(card, {
                        rotateX: rotateX,
                        rotateY: rotateY,
                        y: -8,
                        scale: 1.02,
                        transformPerspective: 1000,
                        duration: 0.3,
                        overwrite: "auto",
                        ease: "power1.out"
                    });
                };

                const onMouseLeave = () => {
                    gsap.to(card, {
                        rotateX: 0,
                        rotateY: 0,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        overwrite: "auto",
                        ease: "power3.out"
                    });
                };

                card.addEventListener('mousemove', onMouseMove);
                card.addEventListener('mouseleave', onMouseLeave);
            });

            // Scroll reveals (fromTo used to avoid double mount initial opacity capture issues)
            gsap.fromTo(".hero-text-side", 
                { opacity: 0, y: 60 },
                { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
            );

            gsap.fromTo(".promos-container", 
                { opacity: 0, y: 50 },
                {
                    scrollTrigger: {
                        trigger: ".promos-section",
                        start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: "power3.out"
                }
            );

            gsap.fromTo(".ingredient-card", 
                { opacity: 0, y: 40 },
                {
                    scrollTrigger: {
                        trigger: ".ingredients-section",
                        start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    opacity: 1,
                    y: 0,
                    stagger: 0.12,
                    duration: 0.8,
                    ease: "power2.out"
                }
            );

            gsap.fromTo(".menu-item-card", 
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: ".menu-section",
                        start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: "power2.out"
                }
            );
        }, mainRef);

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 800);

        return () => {
            ctx.revert();
            clearTimeout(timer);
        };
    }, []);

    return (
        <div ref={mainRef} className="app-wrapper">
            {/* Custom pointer cursor (fine pointers only) */}
            <div className="custom-cursor-dot" />
            <div className="custom-cursor-ring" />

            {/* Navigation Bar */}
            <nav id="main-nav">
                <div className="nav-container">
                    <div className="nav-logo" id="brand-logo">
                        <a href="#inicio" className="nav-logo-link">
                            <img src="/Logo.png" alt="La Herradura Food Logo" className="nav-logo-img" />
                        </a>
                    </div>
                    <ul className="nav-links">
                        <li><a href="#inicio">Inicio</a></li>
                        <li><a href="#promos">Promociones</a></li>
                        <li><a href="#ingredientes">Ingredientes</a></li>
                        <li><a href="#menu">Carta</a></li>
                        <li><a href="#contacto">Contacto</a></li>
                    </ul>
                    <a href="https://wa.me/c/573205692767" className="nav-cta-btn" id="nav-order-btn" target="_blank" rel="noreferrer">
                        <Flame size={16} className="neon-icon" /> ¡Pedir Brutal!
                    </a>
                    <button 
                        className="mobile-nav-toggle" 
                        id="mobile-menu-toggle" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Abrir menú"
                    >
                        <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`} />
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-menu" id="mobile-menu-dropdown">
                        <a href="#inicio" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Inicio</a>
                        <a href="#promos" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Promociones</a>
                        <a href="#ingredientes" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Ingredientes</a>
                        <a href="#menu" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Carta</a>
                        <a href="#contacto" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Contacto</a>
                        <a 
                            href="https://wa.me/c/573205692767" 
                            className="mobile-cta-btn" 
                            target="_blank" 
                            rel="noreferrer"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Flame size={16} style={{ marginRight: '8px' }} /> ¡Pedir Brutal!
                        </a>
                    </div>
                )}
            </nav>

            {/* Pinned 3D Panels Scroll Container (Contains Hero & Historia Cube transition) */}
            <div className="panels-container">
                {/* Hero Section */}
                <header id="inicio" className="panel hero-section">
                    <div className="hero-content-container">
                        <div className="hero-text-side">
                            <div className="tagline-badge">🔥 Sabores Monumentales y Extremos</div>
                            <h1 id="hero-main-title">Sabor brutal<br /><span className="orange-text">a tu manera</span></h1>
                            <p className="hero-description">
                                Combina ingredientes monumentales. Doble carne a la parrilla, plátano maduro frito, queso fundido desbordante y papas cabello de ángel crujientes en el corazón de Palmira.
                            </p>
                            <div className="hero-actions">
                                <a href="#promos" className="btn-primary" id="explore-promos-btn">
                                    Ver Promos de Hoy <ArrowRight size={18} />
                                </a>
                                <a href="https://wa.me/c/573205692767" className="btn-secondary-orange" target="_blank" rel="noreferrer">
                                    Pedir por WhatsApp
                                </a>
                            </div>
                            <div className="hero-features">
                                <div className="feature-item">
                                    <CheckCircle2 className="icon-orange" size={18} />
                                    <span>Promos Diarias</span>
                                </div>
                                <div className="feature-item">
                                    <Flame className="icon-orange" size={18} />
                                    <span>Ingredientes Premium</span>
                                </div>
                                <div className="feature-item">
                                    <Award className="icon-orange" size={18} />
                                    <span>Sede Altamira</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hero-3d-side" id="hero-3d-wrapper">
                            {/* Three.js Canvas Container for Exploded Burger */}
                            <BurgerScene scrollFraction={scrollFraction} mouse={mouse} />
                            <div className="scroll-indicator-text">
                                <MousePointer className="scroll-icon-anim" size={14} /> Scroll para armar la burger
                            </div>
                        </div>
                    </div>
                </header>

                {/* Business Story / Description (Replacing Old Locations Section) */}
                <section id="historia" className="panel history-section">
                    <div className="history-container">
                        <div className="history-text-side">
                            <span className="history-badge"><Info size={14} /> Nuestra Esencia</span>
                            <h2 className="section-title">Del Fuego a tu Mesa</h2>
                            <p className="history-desc">
                                En La Herradura Food, creemos en la abundancia del sabor callejero y la calidad de la cocina artesanal. Fundados en el corazón de Palmira, nos propusimos crear hamburguesas monumentales que combinaran ingredientes tradicionales colombianos (como el plátano maduro y la piña calada artesanal) con carnes seleccionadas de res cocidas al término perfecto de la parrilla.
                            </p>
                            <p className="history-desc">
                                Cada hamburguesa es un testimonio de nuestra dedicación: panes esponjosos brioche, aderezos preparados diariamente y papas cabello de ángel cortadas finamente para dar ese toque crujiente inolvidable. Ven y descubre por qué somos el sabor del que todos hablan en Palmira.
                            </p>
                        </div>
                        <div className="history-visual-side">
                            <div className="history-photo-card">
                                <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop" alt="Grill House Herradura Palmira" />
                                <div className="photo-label">El Fuego Sagrado de La Herradura 🔥</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Daily Promotions Section */}
            <section id="promos" className="promos-section">
                <div className="section-header-centered">
                    <h2 className="section-title">Promociones Brutales</h2>
                    <p className="section-subtitle">Ahorra en grande con nuestros combos y promociones diarias</p>
                </div>
                <div className="promos-container">
                    {/* Day tabs */}
                    <div className="days-tabs-wrapper">
                        <button className={`day-tab ${activeTab === 'combos' ? 'active' : ''}`} onClick={() => handleTabChange('combos')}>Combos Fijos</button>
                        <button className={`day-tab ${activeTab === 'lunes' ? 'active' : ''}`} onClick={() => handleTabChange('lunes')}>Lunes-Miér</button>
                        <button className={`day-tab ${activeTab === 'jueves' ? 'active' : ''}`} onClick={() => handleTabChange('jueves')}>Jueves-Sáb</button>
                        <button className={`day-tab ${activeTab === 'domingo' ? 'active' : ''}`} onClick={() => handleTabChange('domingo')}>Domingos</button>
                    </div>
                    
                    {/* Cards list grid */}
                    <div ref={promosGridRef} className="promos-grid" id="promos-display-grid">
                        {promoData[activeTab].map((item, idx) => (
                            <div className="promo-card" key={idx}>
                                <div className="promo-image">
                                    <img src={item.image} alt={item.title} />
                                    <span className="promo-tag">{item.tag}</span>
                                </div>
                                <div className="promo-content">
                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>{item.desc}</p>
                                    </div>
                                    <div className="promo-footer">
                                        <span className="promo-price">{item.price}</span>
                                        <a href="https://wa.me/c/573205692767" className="btn-promo-order" target="_blank" rel="noreferrer">
                                            Pedir ya <ShoppingCart size={14} style={{ marginLeft: '4px' }} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Exploded Burger Ingredients Info */}
            <section id="ingredientes" className="ingredients-section">
                <div className="section-header-centered">
                    <h2 className="section-title">El Secreto de la Herradura</h2>
                    <p className="section-subtitle">¿Qué hace tan brutal a cada una de nuestras hamburguesas?</p>
                </div>
                <div className="ingredients-grid">
                    <div className="ingredient-card">
                        <div className="ingredient-icon"><i className="fas fa-cheese" /></div>
                        <h3>Queso Fundido</h3>
                        <p>Capa gruesa de queso fundido que desborda por los costados para una cremosidad extrema en cada mordisco.</p>
                    </div>
                    <div className="ingredient-card">
                        <div className="ingredient-icon"><i className="fas fa-bacon" /></div>
                        <h3>Tocineta Crujiente</h3>
                        <p>Bacon ahumado curado cortado grueso y cocinado en su punto para un sabor crocante y ahumado.</p>
                    </div>
                    <div className="ingredient-card">
                        <div className="ingredient-icon"><i className="fas fa-pepper-hot" /></div>
                        <h3>Piña Calada</h3>
                        <p>El toque dulce perfecto, caramelizada de forma artesanal y en rodajas jugosas para balancear el calor del grill.</p>
                    </div>
                    <div className="ingredient-card">
                        <div className="ingredient-icon"><i className="fas fa-stroopwafel" /></div>
                        <h3>Plátano Maduro</h3>
                        <p>Plátano maduro frito en tajadas que añade una textura suave y un contraste dulce inigualable y criollo.</p>
                    </div>
                </div>
            </section>

            {/* Business Story removed here and moved to panels-container at top */}

            {/* Menu / Carta Highlights */}
            <section id="menu" className="menu-section">
                <div className="section-header-centered">
                    <h2 className="section-title">Nuestra Carta Destacada</h2>
                    <p className="section-subtitle">Hazla a tu manera y atrévete a crear extras brutales</p>
                </div>
                <div className="menu-grid">
                    {menuItems.map((item, idx) => (
                        <div className="menu-item-card" key={idx}>
                            <div className="menu-item-image">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="menu-item-info">
                                {item.badge && <span className="menu-badge-best">{item.badge}</span>}
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                            <div className="menu-item-price-cta">
                                <span className="price">{item.price}</span>
                                <a href="https://wa.me/c/573205692767" className="btn-order-item" target="_blank" rel="noreferrer">
                                    Pedir <ShoppingCart size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Unified Footer with Locations, Hours & Map */}
            <footer id="contacto" className="contact-section">
                <div className="contact-container">
                    <div className="contact-grid">
                        {/* Info Column */}
                        <div className="contact-info-block">
                            <div className="contact-brand">
                                <img src="/Logo.png" alt="La Herradura Logo" className="contact-logo-img" />
                                <span className="space-title">LA HERRADURA</span>
                            </div>
                            <p className="contact-bio">
                                Un espacio monumental en Palmira que llegó a conquistar tu paladar y tu bolsillo. Combinamos los mejores ingredientes artesanales, carnes seleccionadas a la parrilla y un sabor verdaderamente brutal.
                            </p>
                            
                            <div className="contact-details-grid">
                                <div className="contact-detail-card">
                                    <MapPin className="detail-icon" size={20} />
                                    <div>
                                        <h4>Ubicación</h4>
                                        <p>Calle 47 # 26-06, Barrio Altamira, Palmira.</p>
                                    </div>
                                </div>
                                <div className="contact-detail-card">
                                    <Clock className="detail-icon" size={20} />
                                    <div>
                                        <h4>Horarios</h4>
                                        <p>Lun a Jue: 5:30 PM - 11:00 PM<br />Vie a Dom: 5:30 PM - 12:00 AM</p>
                                    </div>
                                </div>
                                <div className="contact-detail-card">
                                    <Phone className="detail-icon" size={20} />
                                    <div>
                                        <h4>Domicilios</h4>
                                        <p>+57 320 569 2767</p>
                                    </div>
                                </div>
                            </div>

                            <div className="social-icons">
                                <a href="https://www.instagram.com/laherradurafood/" target="_blank" rel="noreferrer" aria-label="Instagram">
                                    <i className="fab fa-instagram" style={{ fontSize: '18px' }} />
                                </a>
                                <a href="https://wa.me/c/573205692767" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                                    <i className="fab fa-whatsapp" style={{ fontSize: '18px' }} />
                                </a>
                            </div>
                        </div>
                        
                        {/* Map Column */}
                        <div className="contact-map-block">
                            <div className="map-wrapper-card">
                                <div className="map-header">
                                    <MapPin className="text-orange" size={16} />
                                    <span>Sede Altamira, Palmira</span>
                                </div>
                                <div className="map-container-real">
                                    <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.6841284567226!2d-76.292102!3d3.544837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3a75668e1a1215%3A0x6b4ef84ef2a1d471!2sCl.%2047%20%2326-06%2C%20Palmira%2C%20Valle%20del%20Cauca!5e0!3m2!1ses!2sco!4v1719000000000!5m2!1ses!2sco" 
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 0 }} 
                                        allowFullScreen 
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="La Herradura Food Map Location"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="footer-bottom">
                        <p>&copy; 2026 La Herradura Food. Diseñado con la excelencia de <span className="scibaru-credit">Scibaru AI</span>.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
