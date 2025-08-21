// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
    
    // Initialize skill bars animation
    initializeSkillBars();
    
    // Initialize parallax effect
    initializeParallax();
    
    // Initialize form handling
    initializeForm();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
});

// Skill Bars Animation
function initializeSkillBars() {
    const skillsSection = document.getElementById('skills');
    let skillsAnimated = false;
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                animateSkillBars();
                skillsAnimated = true;
            }
        });
    }, { threshold: 0.3 });
    
    skillsObserver.observe(skillsSection);
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width + '%';
        }, index * 200);
    });
}

// Parallax Effect
function initializeParallax() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxBg = document.querySelector('.parallax-bg');
        
        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        // Floating shapes parallax
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach((shape, index) => {
            const speed = 0.2 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${shape.dataset.rotation || 0}deg)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Set initial rotation data for shapes
    document.querySelector('.shape-1').dataset.rotation = '12';
    document.querySelector('.shape-2').dataset.rotation = '-12';
    document.querySelector('.shape-3').dataset.rotation = '45';
}

// Form Handling
function initializeForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        // Simulate form submission
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> MESSAGE SENT!';
            submitBtn.style.background = '#22c55e';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '#4ade80';
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
        
        console.log('Form submitted:', data);
    });
}

// Smooth Scrolling for CTA Button
function initializeSmoothScrolling() {
    const ctaButton = document.querySelector('.cta-button');
    
    ctaButton.addEventListener('click', () => {
        document.getElementById('education').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Add interactive hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Project cards hover effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) rotate(0deg) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            const originalRotation = card.classList.contains('project-card-1') ? 'rotate(1deg)' :
                                   card.classList.contains('project-card-2') ? 'rotate(-1deg)' :
                                   card.classList.contains('project-card-3') ? 'rotate(2deg)' :
                                   'rotate(-2deg)';
            card.style.transform = `translateY(0) ${originalRotation} scale(1)`;
        });
    });
    
    // Certification cards pulse effect
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.cert-icon i');
            icon.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.cert-icon i');
            icon.style.animation = '';
        });
    });
    
    // Tech tags hover effect
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'scale(1.1) rotate(2deg)';
            tag.style.boxShadow = '4px 4px 0px 0px rgba(0, 0, 0, 1)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'scale(1) rotate(0deg)';
            tag.style.boxShadow = '';
        });
    });
    
    // Achievement items hover effect
    const achievementItems = document.querySelectorAll('.achievement-item');
    achievementItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05) rotate(1deg)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Add typing effect to hero description (optional enhancement)
function addTypingEffect() {
    const heroDescription = document.querySelector('.hero-description p');
    const text = heroDescription.textContent;
    heroDescription.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroDescription.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing effect after hero animation
    setTimeout(typeWriter, 2000);
}

// Initialize additional effects
document.addEventListener('DOMContentLoaded', () => {
    // Uncomment to enable typing effect
    // addTypingEffect();
    
    // Add random rotation to floating shapes
    const shapes = document.querySelectorAll('.floating-shape');
    shapes.forEach(shape => {
        setInterval(() => {
            const currentRotation = parseInt(shape.dataset.rotation) || 0;
            const newRotation = currentRotation + (Math.random() - 0.5) * 10;
            shape.dataset.rotation = newRotation;
        }, 3000);
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll-heavy functions
const throttledParallax = throttle(() => {
    // Parallax updates are already optimized with requestAnimationFrame
}, 16);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        const firstAnimatedElement = document.querySelector('.animate-on-scroll');
        if (firstAnimatedElement) {
            firstAnimatedElement.classList.add('animated');
        }
    }, 100);
});
