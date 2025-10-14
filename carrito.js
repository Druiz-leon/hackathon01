document.addEventListener('DOMContentLoaded', () => {

    const cartProductsList = document.getElementById('cart-products-list');
    const subtotalPriceSpan = document.getElementById('subtotal-price');
    const totalPriceSpan = document.getElementById('total-price');
    const clearCartButton = document.getElementById('clear-cart-btn');
    const cartCountSpan = document.querySelector('.cart-count');

    // --- FUNCIONES BÁSICAS DE CARRITO ---
    const getCart = () => JSON.parse(localStorage.getItem('senderaCart')) || [];
    const saveCart = (cart) => {
        localStorage.setItem('senderaCart', JSON.stringify(cart));
        updateCartCounter();
        displayCartProducts();
    };
    
    const updateCartCounter = () => {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountSpan) {
            cartCountSpan.textContent = totalItems;
        }
    };

    // --- FUNCIÓN PRINCIPAL PARA MOSTRAR LOS PRODUCTOS ---
    const displayCartProducts = () => {
        const cart = getCart();
        cartProductsList.innerHTML = '';

        if (cart.length === 0) {
            cartProductsList.innerHTML = '<div class="alert alert-info">Tu carrito está vacío.</div>';
            updateTotals(0);
            return;
        }

        let subtotal = 0;
        cart.forEach(product => {
            const lineTotal = product.price * product.quantity;
            subtotal += lineTotal;

            const productElement = document.createElement('div');
            productElement.classList.add('card', 'mb-3');
            productElement.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div style="flex-grow: 1;">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="mb-1 text-muted">$${product.price.toFixed(2)} c/u</p>
                            <p class="mb-0 fw-bold">Total línea: $${lineTotal.toFixed(2)}</p>
                        </div>
                        <div class="d-flex align-items-center text-nowrap">
                            <button class="btn btn-outline-secondary btn-sm" onclick="changeQuantity('${product.id}', -1)">-</button>
                            <span class="mx-3 fs-5">${product.quantity}</span>
                            <button class="btn btn-outline-secondary btn-sm" onclick="changeQuantity('${product.id}', 1)">+</button>
                            <button class="btn btn-danger btn-sm ms-4" onclick="removeItem('${product.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            cartProductsList.appendChild(productElement);
        });

        updateTotals(subtotal);
    };

    // --- FUNCIÓN PARA ACTUALIZAR LOS TOTALES ---
    const updateTotals = (subtotal) => {
        subtotalPriceSpan.textContent = `$${subtotal.toFixed(2)}`;
        totalPriceSpan.textContent = `$${subtotal.toFixed(2)}`;
    };

    // --- FUNCIONES GLOBALES PARA LOS BOTONES ---
    window.changeQuantity = (productId, amount) => {
        let cart = getCart();
        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex > -1) {
            cart[productIndex].quantity += amount;
            if (cart[productIndex].quantity <= 0) {
                cart.splice(productIndex, 1);
            }
        }
        saveCart(cart);
    };

    window.removeItem = (productId) => {
        let cart = getCart();
        cart = cart.filter(product => product.id !== productId);
        saveCart(cart);
    };

    // --- EVENTO PARA VACIAR TODO EL CARRITO ---
    clearCartButton.addEventListener('click', () => {
        saveCart([]);
    });

    // --- INICIALIZACIÓN ---
    displayCartProducts();
    updateCartCounter();
});