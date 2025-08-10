// --- Import statements from node_modules ---
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// --- Global/Module-scoped utility functions and GSAP registration ---
const smoothStep = (p) => p * p * (3 - 2 * p);
gsap.registerPlugin(ScrollTrigger);

// --- Lenis Smooth Scroll Initialization and RAF loop ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1 - Math.pow(1 - t, 4)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- All DOM-dependent code goes inside a single DOMContentLoaded listener ---
document.addEventListener('DOMContentLoaded', function () {

    // --- Video mute/unmute functionality ---
    const video = document.getElementById('home2ndVideo');
    const muteToggleButton = document.getElementById('muteToggleButton');

    if (video && muteToggleButton) {
        const muteIcon = muteToggleButton.querySelector('i');
        if (muteIcon) {
            muteToggleButton.addEventListener('click', () => {
                if (video.muted) {
                    video.muted = false;
                    muteIcon.classList.remove('fa-volume-mute');
                    muteIcon.classList.add('fa-volume-up');
                } else {
                    video.muted = true;
                    muteIcon.classList.remove('fa-volume-up');
                    muteIcon.classList.add('fa-volume-mute');
                }
            });
            video.addEventListener('volumechange', () => {
                if (video.muted) {
                    muteIcon.classList.remove('fa-volume-up');
                    muteIcon.classList.add('fa-volume-mute');
                } else {
                    muteIcon.classList.remove('fa-volume-mute');
                    muteIcon.classList.add('fa-volume-up');
                }
            });
        }
    }

    // --- Marquee direction change on scroll ---
    const marqueeContainer = document.querySelector('.marquee-container');
    let lastScrollTop = 0;
    if (marqueeContainer) {
        window.addEventListener('scroll', () => {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop) {
                marqueeContainer.classList.remove('reverse-scroll');
            } else if (st < lastScrollTop) {
                marqueeContainer.classList.add('reverse-scroll');
            }
            lastScrollTop = st <= 0 ? 0 : st;
        });
    }

    // --- Home Screen Initial Load Animations with GSAP Timeline ---
    const home1stLeftImg = document.querySelector('#home1st-left-img img');
    const home1stLeftText = document.querySelector('#home1st-left p');
    const home1stRightH1 = document.querySelector('#home1st-right h1');

    const introTimeline = gsap.timeline({
        paused: true,
        defaults: { duration: 0.8, ease: "power2.out" }
    });

    if (home1stLeftImg && home1stLeftText) {
        introTimeline.fromTo(home1stLeftImg,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 }
        )
        .fromTo(home1stLeftText,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.7"
        );
    }

    if (home1stRightH1) {
        introTimeline.fromTo(home1stRightH1,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.7"
        );
    }

    if (home1stLeftImg || home1stLeftText || home1stRightH1) {
        introTimeline.play();
    }

    // --- ScrollTrigger for Hero Cards ---
    const heroSection = document.getElementById('home');
    const heroCards = document.querySelectorAll('.hero-cards .card');

    if (heroSection && heroCards.length > 0) {
        gsap.set(".hero-cards", { opacity: 1 });
        heroCards.forEach(card => {
            gsap.set(card, { y: "0%", x: "0%", rotation: 0, scale: 1, opacity: 1 });
        });

        ScrollTrigger.create({
            trigger: heroSection,
            start: "top top",
            end: "75% top",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const heroCardsContainerOpacity = gsap.utils.interpolate(1, 0.5, smoothStep(progress));
                gsap.set(".hero-cards", { opacity: heroCardsContainerOpacity });

                heroCards.forEach((card, index) => {
                    const delay = index * 0.9;
                    const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (1 - delay * 0.1));
                    const y = gsap.utils.interpolate("0%", "250%", smoothStep(cardProgress));
                    const scale = gsap.utils.interpolate(1, 0.75, smoothStep(cardProgress));
                    let x = "0%";
                    let rotation = 0;

                    if (index === 0) {
                        x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
                        rotation = gsap.utils.interpolate(0, -15, smoothStep(cardProgress));
                    } else if (index === 2) {
                        x = gsap.utils.interpolate("0%", "-90%", smoothStep(cardProgress));
                        rotation = gsap.utils.interpolate(0, 15, smoothStep(cardProgress));
                    }

                    gsap.set(card, {
                        y: y,
                        x: x,
                        rotation: rotation,
                        scale: scale,
                    });
                });
            },
        });
    }

    // --- ScrollTrigger for Services Section ---
    const servicesSection = document.querySelector(".services");
    const flipCards = document.querySelectorAll(".cards-container .card");
    const servicesHeader = document.querySelector(".services-header");

    if (servicesSection) {
        ScrollTrigger.create({
            trigger: servicesSection,
            start: "top top",
            end: `+=${window.innerHeight * 4}px`,
            pin: true,
            pinSpacing: true,
        });

        ScrollTrigger.create({
            trigger: servicesSection,
            start: "top top",
            end: `+=${window.innerHeight * 4}px`,
            onLeave: () => {
                const servicesRect = servicesSection.getBoundingClientRect();
                const servicesTop = window.pageYOffset + servicesRect.top;
                gsap.set(".cards", {
                    position: "absolute",
                    top: servicesTop,
                    left: 0,
                    width: "100vw",
                    height: "100vh"
                });
            },
            onEnterBack: () => {
                gsap.set(".cards", {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh"
                });
            },
        });

        if (servicesHeader && flipCards.length > 0) {
            ScrollTrigger.create({
                trigger: servicesSection,
                start: "top bottom",
                end: `+=${window.innerHeight * 4}`,
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
                    const headerY = gsap.utils.interpolate("400%", "-50%", smoothStep(headerProgress));
                    gsap.set(servicesHeader, { y: headerY });

                    flipCards.forEach((card, index) => {
                        const delay = index * 0.5;
                        const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1));
                        const innerCard = card.querySelector('.flip-card-inner');

                        let y;
                        if (cardProgress < 0.4) {
                            const normalizedProgress = cardProgress / 0.4;
                            y = gsap.utils.interpolate("-100%", "50%", smoothStep(normalizedProgress));
                        } else if (cardProgress < 0.6) {
                            const normalizedProgress = (cardProgress - 0.4) / 0.2;
                            y = gsap.utils.interpolate("50%", "0%", smoothStep(normalizedProgress));
                        } else {
                            y = "0%";
                        }

                        let scale;
                        if (cardProgress < 0.4) {
                            const normalizedProgress = cardProgress / 0.4;
                            scale = gsap.utils.interpolate(0.25, 0.75, smoothStep(normalizedProgress));
                        } else if (cardProgress < 0.6) {
                            const normalizedProgress = (cardProgress - 0.4) / 0.2;
                            scale = gsap.utils.interpolate(0.75, 1, smoothStep(normalizedProgress));
                        } else {
                            scale = 1;
                        }

                        let opacity;
                        if (cardProgress < 0.2) {
                            const normalizedProgress = cardProgress / 0.2;
                            opacity = smoothStep(normalizedProgress);
                        } else {
                            opacity = 1;
                        }

                        let x, rotate, rotationY;
                        if (cardProgress < 0.6) {
                            x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
                            rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
                            rotationY = 0;
                        } else if (cardProgress < 1) {
                            const normalizedProgress = (cardProgress - 0.6) / 0.4;
                            x = gsap.utils.interpolate(
                                index === 0 ? "100%" : index === 1 ? "0%" : "-100%", "0%", smoothStep(normalizedProgress)
                            );
                            rotate = gsap.utils.interpolate(
                                index === 0 ? -5 : index === 1 ? 0 : 5, 0, smoothStep(normalizedProgress)
                            );
                            rotationY = smoothStep(normalizedProgress) * 180;
                        } else {
                            x = "0%";
                            rotate = 0;
                            rotationY = 180;
                        }

                        gsap.set(card, {
                            opacity: opacity,
                            y: y,
                            x: x,
                            rotate: rotate,
                            scale: scale,
                        });

                        gsap.set(innerCard, {
                            rotationY: rotationY,
                        });
                    });
                },
            });
        }
    }
});

// --- Additional Scroll Section (Corrected below) ---
const section = {
    element: document.querySelector('.scroll'),
    subtitle: document.querySelectorAll('.scroll_text_subtitle > *'),
    titleChars: document.querySelectorAll('.scroll_text_title_word span'),
    gallery: document.querySelectorAll('.scroll_gallery'),
    galleryImages: document.querySelectorAll('.scroll_gallery img'),
};

const init = () => {
    gsap.set(section.subtitle, {
        autoAlpha: 0,
    });
    gsap.set(section.titleChars, {
        scale: 0,
        yPercent: -60,
        z: -40,
        rotateY: 180,
        transformOrigin: `50% 50%`,
    });
    initLenis();
    animateScroll();
};

const initLenis = () => {
    const lenis = new Lenis({
        lerp: 0.05,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
};

const animateScroll = () => {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section.element,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            pin: false,
        },
    });

    timeline
        .to(section.gallery, { yPercent: -100 })
        .to(section.galleryImages, { y: -150, stagger: 0.05 }, 0)
        .to(section.titleChars, {
            scale: 1,
            yPercent: 0,
            z: 0,
            rotateY: 0,
            stagger:{
                each:0.1,
                grid:'auto',
                from:'center'
            },
        },
    0
 )
 .to(section.subtitle,{autoAlpha: 1}, 0.25);
};

window.addEventListener('DOMContentLoaded', init);
