// Initialize EmailJS with your User ID
(function() {
    emailjs.init("cd_X3hj5z-I9ji8PU"); // Your EmailJS User ID
})();

// Custom Cursor
const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.classList.add('cursor-dot');
document.body.appendChild(cursorDot);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
});

// Hide cursor on mobile
if (window.innerWidth <= 768) {
    cursor.style.display = 'none';
    cursorDot.style.display = 'none';
}

// Scroll Progress Bar
const scrollProgress = document.createElement('div');
scrollProgress.classList.add('scroll-progress');
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Scroll to Top Button
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTop.classList.add('show');
    } else {
        scrollTop.classList.remove('show');
    }
});

scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (nav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Download CV functionality
document.querySelectorAll('.btn-download').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the file path from href
        const filePath = this.getAttribute('href');
        const fileName = filePath.split('/').pop() || 'Sumana_Mondal_CV.pdf';
        
        // Show download message
        showNotification(`Downloading ${fileName}...`, 'info');
        
        // Try to fetch the file
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('File not found');
                }
                return response.blob();
            })
            .then(blob => {
                // Create blob URL and trigger download
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                showNotification(`${fileName} downloaded successfully!`, 'success');
            })
            .catch(error => {
                console.error('Download error:', error);
                showNotification('CV file not found. Please contact me directly.', 'error');
            });
    });
});

// Contact Form Handling with your EmailJS credentials
const contactForm = document.getElementById('contactForm');

// Function to show notification
function showNotification(message, type = 'success') {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-tertiary);
        border-left: 4px solid var(--primary);
        border-radius: var(--radius-md);
        padding: 16px 24px;
        box-shadow: var(--shadow-xl), var(--glow-primary);
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        backdrop-filter: var(--blur-md);
        border: 1px solid rgba(59, 130, 246, 0.2);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-content i {
        font-size: 24px;
    }
    
    .notification-success {
        border-left-color: var(--success);
    }
    
    .notification-success i {
        color: var(--success);
    }
    
    .notification-error {
        border-left-color: var(--danger);
    }
    
    .notification-error i {
        color: var(--danger);
    }
    
    .notification-info {
        border-left-color: var(--primary);
    }
    
    .notification-info i {
        color: var(--primary);
    }
    
    .notification-content span {
        color: var(--text-primary);
        font-size: 15px;
        font-weight: 500;
    }
`;
document.head.appendChild(notificationStyles);

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Contact form submission with your EmailJS credentials
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Send email using EmailJS with your credentials
        emailjs.send(
            'service_sumana',           // Your Service ID
            'template_h4sextq',         // Your Template ID
            {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
                to_email: 'sumanamondal329@gmail.com',
                reply_to: formData.email
            }
        )
        .then(function(response) {
            // Success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Remove focused class from form inputs
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('focused');
            });
        })
        .catch(function(error) {
            // Error message
            console.error('EmailJS Error:', error);
            showNotification('Failed to send message. Please try again or email me directly.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul li a');

function updateActiveNavLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100; // Offset for header
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').replace('#', '');
        if (href === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Form input animation
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (input.value === '') {
            input.parentElement.classList.remove('focused');
        }
    });
    
    // Check if input has value on page load
    if (input.value !== '') {
        input.parentElement.classList.add('focused');
    }
});

// Scroll reveal animation
const revealElements = document.querySelectorAll('.skill-item, .project-card, .timeline-item, .hobby-item, .contact-item, .achievement-item');

function reveal() {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

// Loading animation
const loader = document.createElement('div');
loader.classList.add('loader');
document.body.appendChild(loader);

window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 500);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Typing effect for hero title
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.display = 'inline-block';
    heroTitle.style.borderRight = '3px solid var(--primary)';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            heroTitle.style.borderRight = 'none';
        }
    }
    
    // Start typing effect after loader
    setTimeout(typeWriter, 1000);
}

// Year update in footer
const yearElement = document.querySelector('.copyright p');
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
}

// Particle effect for hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.3};
            animation: floatParticle ${Math.random() * 15 + 10}s linear infinite;
            pointer-events: none;
            z-index: 1;
        `;
        hero.appendChild(particle);
    }
}

// Add particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0) translateX(0);
        }
        25% {
            transform: translateY(-20vh) translateX(10vw);
        }
        50% {
            transform: translateY(-40vh) translateX(-10vw);
        }
        75% {
            transform: translateY(-60vh) translateX(5vw);
        }
        100% {
            transform: translateY(-80vh) translateX(0);
        }
    }
`;
document.head.appendChild(particleStyle);

// Create particles on load
window.addEventListener('load', createParticles);

// Hover effect for project cards
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-12px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Intersection Observer for lazy loading images
const images = document.querySelectorAll('img:not([loading])');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            
            // If image has data-src, set it
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

images.forEach(img => imageObserver.observe(img));

// Add loaded class style
const imgStyle = document.createElement('style');
imgStyle.textContent = `
    img {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    img.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(imgStyle);

// Smooth reveal for sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            
            // Trigger reveal for elements within the section
            const elements = entry.target.querySelectorAll('.skill-item, .project-card, .timeline-item, .hobby-item, .contact-item, .achievement-item');
            elements.forEach(el => {
                el.classList.add('revealed');
            });
        }
    });
}, { threshold: 0.1, rootMargin: '0px' });

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Handle keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.querySelectorAll('.btn, .project-card, .hobby-item').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}
