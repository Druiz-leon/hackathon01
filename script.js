document.addEventListener('DOMContentLoaded', () => {

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountSpan = document.querySelector('.cart-count');

    // --- FUNCIONES PARA GESTIONAR EL CARRITO EN localStorage ---
    const getCart = () => JSON.parse(localStorage.getItem('senderaCart')) || [];
    const saveCart = (cart) => {
        localStorage.setItem('senderaCart', JSON.stringify(cart));
        updateCartCounter();
    };

    // --- FUNCIÓN PARA ACTUALIZAR SOLO EL NÚMERO EN EL ÍCONO ---
    const updateCartCounter = () => {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountSpan) {
            cartCountSpan.textContent = totalItems;
        }
    };

    // --- LÓGICA MEJORADA PARA AÑADIR AL CARRITO ---
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.dataset.productName;
            const productPrice = parseFloat(button.dataset.productPrice);

            const cart = getCart();
            const existingProductIndex = cart.findIndex(item => item.name === productName);

            if (existingProductIndex > -1) {
                // Si ya existe, incrementamos su cantidad
                cart[existingProductIndex].quantity += 1;
            } else {
                // Si no existe, lo añadimos con cantidad 1
                const newProduct = {
                    id: productName, // Usamos el nombre como ID único
                    name: productName,
                    price: productPrice,
                    quantity: 1 // Propiedad clave
                };
                cart.push(newProduct);
            }

            saveCart(cart);
            showAlert(`✅ "${productName}" se añadió a tu carrito.`);
        });
    });
    
    // --- FUNCIÓN PARA MOSTRAR ALERTA ---
    function showAlert(message) {
        const alertContainer = document.getElementById('alert-container');
        if (!alertContainer) return;
        const alertHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        alertContainer.innerHTML = alertHTML;
        setTimeout(() => document.querySelector('#alert-container .alert')?.remove(), 3000);
    }

    // Actualizamos el contador al cargar la página
    updateCartCounter();
});