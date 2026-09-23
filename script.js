document.addEventListener("DOMContentLoaded", () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Typewriter
    const roles = ["Web Developer", "Python Programmer", "BCA Student"];
    const typeWriterElement = document.getElementById("typewriter");
    
    if (typeWriterElement) {
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typeWriterElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeWriterElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? 30 : 80;

            if (!isDeleting && charIndex === currentRole.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 400;
            }

            setTimeout(type, speed);
        }
        setTimeout(type, 800);
    }

    // Mobile Menu
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            const icon = menuBtn.querySelector('i');
            if (mobileNav.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Fade up animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // --- 3D TILT ENGINE ---
    // Responds to mouse movement over skill cards, giving a parallax depth effect.
    // Uses requestAnimationFrame to keep it smooth and off the main thread as much as possible.
    const TILT_MAX = 12; // Max degrees of tilt

    function applyTilt(el, e) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotX = (-dy * TILT_MAX).toFixed(2);
        const rotY = (dx * TILT_MAX).toFixed(2);
        el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
    }

    function resetTilt(el) {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s var(--ease-return)';
        setTimeout(() => { el.style.transition = ''; }, 500);
    }

    document.querySelectorAll('.skill-group').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => applyTilt(card, e));
        });
        card.addEventListener('mouseleave', () => resetTilt(card));
    });

    // --- CURSOR GLOW SPOTLIGHT ---
    // A soft radial gradient that follows the cursor, giving the page a "lit from the cursor" feel.
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let glowX = -500, glowY = -500;
    let currentX = -500, currentY = -500;
    let glowRaf;

    document.addEventListener('mousemove', (e) => {
        glowX = e.clientX;
        glowY = e.clientY;
        if (!glowRaf) {
            glowRaf = requestAnimationFrame(animateGlow);
        }
    });

    function animateGlow() {
        // Lerp (linear interpolation) for smooth trailing effect
        currentX += (glowX - currentX) * 0.08;
        currentY += (glowY - currentY) * 0.08;
        glow.style.transform = `translate(${currentX}px, ${currentY}px)`;

        // Keep animating only if still moving
        if (Math.abs(glowX - currentX) > 0.5 || Math.abs(glowY - currentY) > 0.5) {
            glowRaf = requestAnimationFrame(animateGlow);
        } else {
            glowRaf = null;
        }
    }

    // --- MAGNETIC BUTTON EFFECT ---
    // Buttons gently snap toward the cursor when hovering nearby, then spring back.
    document.querySelectorAll('.btn, .social-links a').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) * 0.25;
            const dy = (e.clientY - cy) * 0.25;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
            btn.style.transition = 'transform 0.1s linear';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.5s var(--ease-spring)';
        });
    });

    // --- STAGGERED CERT LIST ENTRANCE ---
    // Each certification slides in one after another for a polished "reveal" feel.
    const certItems = document.querySelectorAll('.cert-list li');
    const certObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            certItems.forEach((item, i) => {
                setTimeout(() => item.classList.add('cert-visible'), i * 120);
            });
            certObserver.disconnect();
        }
    }, { threshold: 0.2 });
    if (certItems.length) certObserver.observe(certItems[0].closest('section') || certItems[0]);

});
