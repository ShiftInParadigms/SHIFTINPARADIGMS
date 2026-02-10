/**
 * PayPal Integration for Shifting Paradigms
 * This script handles PayPal payment processing for courses, books, and other products
 */

// PayPal configuration
const paypalConfig = {
    // PayPal client ID for production
    clientId: 'AV31Z6zm0WjOo8BMXISH9QzpkJMgBQjvdstSslbuhz7jzj-z24hwfihyH60gq7My4J4kegDNQHA3PN44',
    currency: 'AUD', // Australian Dollar
    intent: 'capture',
    
    // Environment setting - 'sandbox' for testing, 'production' for live
    environment: 'production'
};

// Cart management
const shoppingCart = {
    items: [],
    
    // Add item to cart
    addItem: function(id, name, price, type, quantity = 1) {
        // Check if item already exists in cart
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id,
                name,
                price: parseFloat(price),
                type,
                quantity
            });
        }
        
        // Update cart UI
        this.updateCartUI();
        
        // Save cart to local storage
        this.saveCart();
        
        // Show notification
        showNotification(`${name} added to your cart`);
    },
    
    // Remove item from cart
    removeItem: function(id) {
        const index = this.items.findIndex(item => item.id === id);
        
        if (index !== -1) {
            const removedItem = this.items[index];
            this.items.splice(index, 1);
            
            // Update cart UI
            this.updateCartUI();
            
            // Save cart to local storage
            this.saveCart();
            
            // Show notification
            showNotification(`${removedItem.name} removed from your cart`);
        }
    },
    
    // Update item quantity
    updateQuantity: function(id, quantity) {
        const item = this.items.find(item => item.id === id);
        
        if (item) {
            item.quantity = parseInt(quantity);
            
            // Remove item if quantity is 0
            if (item.quantity <= 0) {
                this.removeItem(id);
                return;
            }
            
            // Update cart UI
            this.updateCartUI();
            
            // Save cart to local storage
            this.saveCart();
        }
    },
    
    // Calculate cart total
    getTotal: function() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },
    
    // Get item count
    getItemCount: function() {
        return this.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
    },
    
    // Clear cart
    clearCart: function() {
        this.items = [];
        
        // Update cart UI
        this.updateCartUI();
        
        // Save cart to local storage
        this.saveCart();
    },
    
    // Save cart to local storage
    saveCart: function() {
        localStorage.setItem('shiftingParadigmsCart', JSON.stringify(this.items));
    },
    
    // Load cart from local storage
    loadCart: function() {
        const savedCart = localStorage.getItem('shiftingParadigmsCart');
        
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartUI();
        }
    },
    
    // Update cart UI
    updateCartUI: function() {
        // Update cart count in header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
        
        // Update cart page if on cart page
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    },
    
    // Render cart items on cart page
    renderCartPage: function() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummaryTotal = document.querySelector('.cart-summary-total');
        const emptyCartMessage = document.querySelector('.empty-cart-message');
        const cartContent = document.querySelector('.cart-content');
        
        if (!cartItemsContainer) return;
        
        // Clear existing items
        cartItemsContainer.innerHTML = '';
        
        if (this.items.length === 0) {
            // Show empty cart message
            if (emptyCartMessage && cartContent) {
                emptyCartMessage.style.display = 'block';
                cartContent.style.display = 'none';
            }
            return;
        }
        
        // Hide empty cart message and show cart content
        if (emptyCartMessage && cartContent) {
            emptyCartMessage.style.display = 'none';
            cartContent.style.display = 'block';
        }
        
        // Add each item to the cart
        this.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <span class="cart-item-type">${item.type}</span>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update total
        if (cartSummaryTotal) {
            cartSummaryTotal.textContent = `$${this.getTotal().toFixed(2)}`;
        }
        
        // Add event listeners for quantity buttons and remove buttons
        this.addCartEventListeners();
    },
    
    // Add event listeners to cart elements
    addCartEventListeners: function() {
        // Quantity decrease buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = this.items.find(item => item.id === id);
                
                if (item && item.quantity > 1) {
                    this.updateQuantity(id, item.quantity - 1);
                }
            });
        });
        
        // Quantity increase buttons
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = this.items.find(item => item.id === id);
                
                if (item) {
                    this.updateQuantity(id, item.quantity + 1);
                }
            });
        });
        
        // Quantity input fields
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', () => {
                const id = input.getAttribute('data-id');
                const quantity = parseInt(input.value);
                
                if (!isNaN(quantity) && quantity > 0) {
                    this.updateQuantity(id, quantity);
                } else {
                    // Reset to previous value if invalid
                    const item = this.items.find(item => item.id === id);
                    if (item) {
                        input.value = item.quantity;
                    }
                }
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                this.removeItem(id);
            });
        });
    }
};

// Initialize PayPal buttons
function initializePayPalButtons() {
    initPayPalButtons();
}

function initPayPalButtons() {
    if (!window.paypal || !document.querySelector('#paypal-button-container')) {
        return;
    }
    
    // Clear any existing buttons
    document.querySelector('#paypal-button-container').innerHTML = '';
    
    // Render PayPal buttons
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'pay'
        },
        
        // Create order
        createOrder: function(data, actions) {
            // Calculate total
            const total = shoppingCart.getTotal().toFixed(2);
            
            // Create order
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: paypalConfig.currency,
                        value: total
                    },
                    description: 'Shifting Paradigms Purchase'
                }]
            });
        },
        
        // Handle approval
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Show success message
                showNotification('Payment successful! Thank you for your purchase.');
                
                // Process order (in a real app, this would make an API call)
                processOrder(details);
                
                // Clear cart
                shoppingCart.clearCart();
                
                // Redirect to thank you page
                setTimeout(() => {
                    window.location.href = 'thank-you.html';
                }, 1500);
            });
        },
        
        // Handle errors
        onError: function(err) {
            console.error('PayPal Error:', err);
            showNotification('There was an error processing your payment. Please try again.', 'error');
        }
    }).render('#paypal-button-container');
}

// Process order after successful payment
function processOrder(paymentDetails) {
    // In a real application, this would make an API call to your server
    // to process the order, create user access to purchased courses, etc.
    
    // For demo purposes, we'll just log the details and save to local storage
    console.log('Processing order:', paymentDetails);
    
    // Save purchased items to local storage
    const purchasedItems = shoppingCart.items.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        price: item.price,
        quantity: item.quantity,
        purchaseDate: new Date().toISOString()
    }));
    
    // Get existing purchases or initialize empty array
    const existingPurchases = JSON.parse(localStorage.getItem('shiftingParadigmsPurchases') || '[]');
    
    // Add new purchases
    const allPurchases = [...existingPurchases, ...purchasedItems];
    
    // Save to local storage
    localStorage.setItem('shiftingParadigmsPurchases', JSON.stringify(allPurchases));
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from local storage
    shoppingCart.loadCart();
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const type = this.getAttribute('data-type');
            
            shoppingCart.addItem(id, name, price, type);
        });
    });
    
    // Initialize PayPal buttons if on cart page
    if (window.location.pathname.includes('cart.html')) {
        // Load PayPal SDK
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=${paypalConfig.currency}`;
        script.addEventListener('load', initPayPalButtons);
        document.body.appendChild(script);
    }
});

// Export for use in other scripts
window.shoppingCart = shoppingCart;
