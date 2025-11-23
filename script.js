// ===================== DOM Ready =====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing scripts');
    
    // ===================== Scroll to Top =====================
    const scrollTop = document.getElementById('scrollTop');
    if (scrollTop) {
        console.log('Scroll to top button found');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTop.classList.add('show');
            } else {
                scrollTop.classList.remove('show');
            }
        });
        
        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    } else {
        console.log('Scroll to top button NOT found');
    }

    // ===================== Smooth Navigation =====================
    const navLinks = document.querySelectorAll('nav a');
    console.log('Found', navLinks.length, 'navigation links');
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({ 
                        top: target.offsetTop - 70, 
                        behavior: 'smooth' 
                    });
                } else {
                    console.log('Target not found:', href);
                }
            }
        });
    });

    // ===================== Contact Form =====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log('Contact form found');
        initializeContactForm();
    } else {
        console.log('Contact form NOT found');
    }
});

// ===================== Contact Form Initialization =====================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded');
        showNotification('Email service not available. Please refresh the page.', 'error');
        return;
    }

    // Initialize EmailJS with your public key
    try {
        emailjs.init("yBNOs0pzoTt66Uw-A"); // Your corrected Public Key
        console.log('EmailJS initialized with key: taRKxScWVeJccLAq7');
    } catch (error) {
        console.error('EmailJS init failed:', error);
        showNotification('Email service configuration error.', 'error');
        return;
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        // Get form values with null checks
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        if (!nameInput || !emailInput || !messageInput) {
            showNotification('Form fields not found.', 'error');
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            console.log('Sending email...');
            
            const templateParams = {
                from_name: name,
                from_email: email,
                to_name: 'Sumana Mondal',
                message: message,
                reply_to: email
            };

            // Send email with YOUR CORRECT service ID and template ID
            const response = await emailjs.send(
                'sumana_mail',           // Your Service ID
                'template_bg0qiw9',      // Your Template ID
                templateParams
            );
            
            console.log('Email sent successfully:', response);
            showNotification('Message sent successfully! I will get back to you soon.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Email sending failed:', error);
            let errorMessage = 'Error sending message. Please try again later.';
            
            // More specific error messages
            if (error.text) {
                if (error.text.includes('Invalid template ID')) {
                    errorMessage = 'Email template error. Please check template ID.';
                } else if (error.text.includes('Invalid service ID')) {
                    errorMessage = 'Email service error. Please check service ID.';
                } else if (error.text.includes('Public key is invalid')) {
                    errorMessage = 'Email service configuration error.';
                }
                console.error('EmailJS error details:', error.text);
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===================== Notification Function =====================
function showNotification(message, type) {
    console.log('Showing notification:', type, message);
    
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Styling
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
    `;

    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}