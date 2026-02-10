/* Main JavaScript for Shifting Paradigms Website */

document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle for mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Scroll animation for elements
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkFade);
    checkFade(); // Check on initial load
    
    // Cosmic particles background
    createCosmicParticles();
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!validateForm(form)) {
                event.preventDefault();
            }
        });
    });
});

// Create cosmic particles in the background
function createCosmicParticles() {
    const particlesContainer = document.querySelector('.cosmic-particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random opacity
        const opacity = Math.random() * 0.5 + 0.3;
        
        // Random animation duration
        const duration = Math.random() * 50 + 30;
        
        // Set styles
        particle.style.cssText = `
            position: absolute;
            top: ${posY}%;
            left: ${posX}%;
            width: ${size}px;
            height: ${size}px;
            background-color: rgba(248, 247, 255, ${opacity});
            border-radius: 50%;
            pointer-events: none;
            animation: twinkle ${duration}s infinite ease-in-out;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Form validation function
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Create or update error message
            let errorMsg = input.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('div');
                errorMsg.classList.add('error-message');
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }
            errorMsg.textContent = 'This field is required';
        } else if (input.type === 'email' && input.value && !validateEmail(input.value)) {
            isValid = false;
            input.classList.add('error');
            
            // Create or update error message
            let errorMsg = input.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('div');
                errorMsg.classList.add('error-message');
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }
            errorMsg.textContent = 'Please enter a valid email address';
        } else {
            input.classList.remove('error');
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });
    
    return isValid;
}

// Email validation helper
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Shopping cart functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.loadFromStorage();
    }
    
    addItem(id, name, price, type) {
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: id,
                name: name,
                price: price,
                type: type,
                quantity: 1
            });
        }
        
        this.updateTotal();
        this.saveToStorage();
        this.updateCartUI();
    }
    
    removeItem(id) {
        const index = this.items.findIndex(item => item.id === id);
        
        if (index !== -1) {
            this.items.splice(index, 1);
            this.updateTotal();
            this.saveToStorage();
            this.updateCartUI();
        }
    }
    
    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.updateTotal();
                this.saveToStorage();
                this.updateCartUI();
            }
        }
    }
    
    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    saveToStorage() {
        localStorage.setItem('shiftingParadigmsCart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    }
    
    loadFromStorage() {
        const savedCart = localStorage.getItem('shiftingParadigmsCart');
        
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            this.items = parsedCart.items || [];
            this.total = parsedCart.total || 0;
        }
    }
    
    clearCart() {
        this.items = [];
        this.total = 0;
        this.saveToStorage();
        this.updateCartUI();
    }
    
    updateCartUI() {
        // Update cart count in header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
            cartCount.textContent = itemCount;
            
            if (itemCount > 0) {
                cartCount.classList.add('has-items');
            } else {
                cartCount.classList.remove('has-items');
            }
        }
        
        // Update cart page if it exists
        const cartItemsContainer = document.querySelector('.cart-items');
        if (cartItemsContainer) {
            this.renderCartItems(cartItemsContainer);
        }
        
        // Update cart total
        const cartTotal = document.querySelector('.cart-total-amount');
        if (cartTotal) {
            cartTotal.textContent = `$${this.total.toFixed(2)}`;
        }
    }
    
    renderCartItems(container) {
        container.innerHTML = '';
        
        if (this.items.length === 0) {
            container.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            return;
        }
        
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-type">${item.type}</p>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item" data-id="${item.id}">×</button>
            `;
            
            container.appendChild(itemElement);
        });
        
        // Add event listeners to cart item controls
        const decreaseButtons = container.querySelectorAll('.quantity-btn.decrease');
        const increaseButtons = container.querySelectorAll('.quantity-btn.increase');
        const quantityInputs = container.querySelectorAll('.cart-item-quantity input');
        const removeButtons = container.querySelectorAll('.remove-item');
        
        decreaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = this.items.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    this.updateQuantity(id, item.quantity - 1);
                }
            });
        });
        
        increaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = this.items.find(item => item.id === id);
                if (item) {
                    this.updateQuantity(id, item.quantity + 1);
                }
            });
        });
        
        quantityInputs.forEach(input => {
            input.addEventListener('change', () => {
                const id = input.getAttribute('data-id');
                this.updateQuantity(id, input.value);
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                this.removeItem(id);
            });
        });
    }
}

// Initialize shopping cart
const cart = new ShoppingCart();

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const type = this.getAttribute('data-type');
            
            cart.addItem(id, name, price, type);
            
            // Show confirmation message
            const confirmMessage = document.createElement('div');
            confirmMessage.classList.add('cart-confirmation');
            confirmMessage.textContent = `${name} added to cart!`;
            document.body.appendChild(confirmMessage);
            
            setTimeout(() => {
                confirmMessage.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                confirmMessage.classList.remove('show');
                setTimeout(() => {
                    confirmMessage.remove();
                }, 300);
            }, 2000);
        });
    });
});

// User authentication state
class UserAuth {
    constructor() {
        this.isLoggedIn = false;
        this.user = null;
        this.checkLoginState();
    }
    
    checkLoginState() {
        const userData = localStorage.getItem('shiftingParadigmsUser');
        
        if (userData) {
            try {
                this.user = JSON.parse(userData);
                this.isLoggedIn = true;
                this.updateAuthUI();
            } catch (e) {
                console.error('Error parsing user data:', e);
                this.logout();
            }
        }
    }
    
    login(email, password) {
        // In a real implementation, this would make an API call to verify credentials
        // For demo purposes, we'll simulate a successful login
        
        // Simulate API call delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    this.user = {
                        email: email,
                        name: email.split('@')[0],
                        id: 'user_' + Date.now()
                    };
                    
                    this.isLoggedIn = true;
                    localStorage.setItem('shiftingParadigmsUser', JSON.stringify(this.user));
                    this.updateAuthUI();
                    resolve(this.user);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    }
    
    register(email, password, name) {
        // In a real implementation, this would make an API call to create a new user
        // For demo purposes, we'll simulate a successful registration
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password && name) {
                    this.user = {
                        email: email,
                        name: name,
                        id: 'user_' + Date.now()
                    };
                    
                    this.isLoggedIn = true;
                    localStorage.setItem('shiftingParadigmsUser', JSON.stringify(this.user));
                    this.updateAuthUI();
                    resolve(this.user);
                } else {
                    reject(new Error('Invalid registration data'));
                }
            }, 1000);
        });
    }
    
    logout() {
        this.isLoggedIn = false;
        this.user = null;
        localStorage.removeItem('shiftingParadigmsUser');
        this.updateAuthUI();
    }
    
    updateAuthUI() {
        const authLinks = document.querySelectorAll('.auth-link');
        const userMenus = document.querySelectorAll('.user-menu');
        const userNames = document.querySelectorAll('.user-name');
        
        if (this.isLoggedIn) {
            // Update UI for logged in state
            authLinks.forEach(link => {
                link.style.display = 'none';
            });
            
            userMenus.forEach(menu => {
                menu.style.display = 'block';
            });
            
            userNames.forEach(name => {
                name.textContent = this.user.name;
            });
            
            // Show restricted content
            const restrictedContent = document.querySelectorAll('.restricted-content');
            restrictedContent.forEach(content => {
                content.classList.remove('hidden');
            });
        } else {
            // Update UI for logged out state
            authLinks.forEach(link => {
                link.style.display = 'block';
            });
            
            userMenus.forEach(menu => {
                menu.style.display = 'none';
            });
            
            // Hide restricted content
            const restrictedContent = document.querySelectorAll('.restricted-content');
            restrictedContent.forEach(content => {
                content.classList.add('hidden');
            });
        }
    }
}

// Initialize user authentication
const userAuth = new UserAuth();

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButtons = document.querySelectorAll('.logout-button');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = this.querySelector('input[name="email"]').value;
            const password = this.querySelector('input[name="password"]').value;
            const submitButton = this.querySelector('button[type="submit"]');
            const errorMessage = this.querySelector('.form-error');
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = 'Logging in...';
            
            userAuth.login(email, password)
                .then(() => {
                    // Redirect to account page or reload
                    window.location.href = 'account.html';
                })
                .catch(error => {
                    // Show error message
                    if (errorMessage) {
                        errorMessage.textContent = error.message;
                        errorMessage.style.display = 'block';
                    }
                })
                .finally(() => {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Login';
                });
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const password = this.querySelector('input[name="password"]').value;
            const confirmPassword = this.querySelector('input[name="confirm-password"]').value;
            const submitButton = this.querySelector('button[type="submit"]');
            const errorMessage = this.querySelector('.form-error');
            
            // Validate passwords match
            if (password !== confirmPassword) {
                if (errorMessage) {
                    errorMessage.textContent = 'Passwords do not match';
                    errorMessage.style.display = 'block';
                }
                return;
            }
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = 'Creating account...';
            
            userAuth.register(email, password, name)
                .then(() => {
                    // Redirect to account page
                    window.location.href = 'account.html';
                })
                .catch(error => {
                    // Show error message
                    if (errorMessage) {
                        errorMessage.textContent = error.message;
                        errorMessage.style.display = 'block';
                    }
                })
                .finally(() => {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Create Account';
                });
        });
    }
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            userAuth.logout();
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    });
});
