/* ============================================
   DIGITAL CONNECT - Agency Website
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // NAVBAR & ACTIVE LINK
    // ============================================
    const navLinks = document.querySelectorAll('.nav-link:not(.cta-btn)');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // ============================================
    // MOBILE MENU
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });
    
    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // COUNTER ANIMATION
    // ============================================
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 1500;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    // ============================================
    // PORTFOLIO FILTER
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // ============================================
    // MULTI-STEP FORM
    // ============================================
    const form = document.getElementById('devis-form');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    const btnSubmit = document.querySelector('.btn-submit');
    const formSuccess = document.querySelector('.form-success');
    
    let currentStep = 1;
    const totalSteps = formSteps.length;
    
    function updateFormStep() {
        formSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.getAttribute('data-step')) === currentStep) {
                step.classList.add('active');
            }
        });
        
        progressSteps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });
        
        btnPrev.style.display = currentStep === 1 ? 'none' : 'flex';
        btnNext.style.display = currentStep === totalSteps ? 'none' : 'flex';
        btnSubmit.style.display = currentStep === totalSteps ? 'flex' : 'none';
    }
    
    function validateStep(step) {
        if (step === 1) {
            const selectedType = document.querySelector('input[name="project-type"]:checked');
            if (!selectedType) {
                showNotification('Sélectionnez un type de projet !', 'error');
                return false;
            }
        }
        
        if (step === 2) {
            const budget = document.getElementById('budget').value;
            const deadline = document.getElementById('deadline').value;
            const description = document.getElementById('description').value;
            if (!budget || !deadline || !description) {
                showNotification('Remplissez tous les champs !', 'error');
                return false;
            }
        }
        
        if (step === 3) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            if (!name || !email) {
                showNotification('Nom et email requis !', 'error');
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showNotification('Email invalide !', 'error');
                return false;
            }
        }
        
        return true;
    }
    
    btnNext.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateFormStep();
        }
    });
    
    btnPrev.addEventListener('click', () => {
        currentStep--;
        updateFormStep();
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // Collecter toutes les données du formulaire
            const formData = new FormData();
            formData.append('Type de projet', document.querySelector('input[name="project-type"]:checked')?.value || '');
            formData.append('Budget', document.getElementById('budget').value);
            formData.append('Délai', document.getElementById('deadline').value);
            formData.append('Description', document.getElementById('description').value);
            formData.append('Nom', document.getElementById('name').value);
            formData.append('Entreprise', document.getElementById('company').value);
            formData.append('Email', document.getElementById('email').value);
            formData.append('Téléphone', document.getElementById('phone').value);
            
            // Envoyer à Formspree
            try {
                const response = await fetch('https://formspree.io/f/mykkylqa', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    form.style.display = 'none';
                    formSuccess.style.display = 'block';
                    showNotification('✅ Demande envoyée avec succès !', 'success');
                } else {
                    showNotification('❌ Erreur lors de l\'envoi. Réessayez.', 'error');
                }
            } catch (error) {
                showNotification('❌ Erreur de connexion. Réessayez.', 'error');
            }
        }
    });
    
    // ============================================
    // NOTIFICATIONS
    // ============================================
    function showNotification(message, type) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        const icon = type === 'success' ? '✅' : '⚠️';
        notification.innerHTML = `<span style="margin-right:10px">${icon}</span>${message}`;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 1.5rem',
            background: type === 'success' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#f8fafc',
            border: '3px solid #22d3ee',
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.4), 6px 6px 0px rgba(0,0,0,0.3)',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: '700',
            fontSize: '1.1rem',
            zIndex: '10001',
            borderRadius: '10px'
        });
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
    
    // Initialize
    updateFormStep();
    console.log('🚀 Digital Connect - Ready!');
});
