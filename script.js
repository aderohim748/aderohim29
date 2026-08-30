/* =================================
   FOODIFY JAVASCRIPT
================================= */

let cart = [];

const cartButton = document.getElementById("cartButton");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const products = document.querySelectorAll(".product-card");
const categories = document.querySelectorAll(".category");

const searchInput = document.getElementById("searchInput");


/* =================================
   CART OPEN / CLOSE
================================= */

cartButton.addEventListener("click", () => {

    cartSidebar.classList.add("open");
    cartOverlay.classList.add("show");

});


closeCart.addEventListener("click", closeCartSidebar);

cartOverlay.addEventListener("click", closeCartSidebar);


function closeCartSidebar() {

    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("show");

}


/* =================================
   ADD TO CART
================================= */

function addToCart(name, price) {

    const existingItem = cart.find(
        item => item.name === name
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    updateCart();

    // Open cart automatically
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("show");

}


/* =================================
   REMOVE FROM CART
================================= */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


/* =================================
   UPDATE CART
================================= */

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <span>🛒</span>
                <p>Keranjang masih kosong</p>
            </div>
        `;

    } else {

        cart.forEach((item, index) => {

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `

                <div class="cart-item-icon">
                    ${getFoodIcon(item.name)}
                </div>

                <div class="cart-item-info">

                    <h4>${item.name}</h4>

                    <p>
                        ${item.quantity} ×
                        ${formatRupiah(item.price)}
                    </p>

                </div>

                <button
                    class="remove-item"
                    onclick="removeFromCart(${index})"
                >
                    ×
                </button>

            `;

            cartItems.appendChild(cartItem);

        });

    }


    // Count
    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;


    // Total price
    const totalPrice = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    cartTotal.textContent = formatRupiah(totalPrice);

}


/* =================================
   FOOD ICON
================================= */

function getFoodIcon(name) {

    const lowerName = name.toLowerCase();

    if (lowerName.includes("burger")) {
        return "🍔";
    }

    if (lowerName.includes("pizza")) {
        return "🍕";
    }

    if (lowerName.includes("coffee")) {
        return "☕";
    }

    if (lowerName.includes("cake")) {
        return "🍰";
    }

    if (lowerName.includes("fries")) {
        return "🍟";
    }

    return "🍽️";

}


/* =================================
   FORMAT RUPIAH
================================= */

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);

}


/* =================================
   CATEGORY FILTER
================================= */

categories.forEach(category => {

    category.addEventListener("click", () => {

        categories.forEach(item => {
            item.classList.remove("active");
        });

        category.classList.add("active");

        const selectedCategory =
            category.dataset.category;

        products.forEach(product => {

            const productCategory =
                product.dataset.category;

            if (
                selectedCategory === "all" ||
                productCategory === selectedCategory
            ) {

                product.style.display = "block";

            } else {

                product.style.display = "none";

            }

        });

    });

});


/* =================================
   SEARCH
================================= */

searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value.toLowerCase().trim();

    products.forEach(product => {

        const productName =
            product.dataset.name.toLowerCase();

        if (productName.includes(keyword)) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });

});


/* =================================
   SCROLL TO PRODUCTS
================================= */

function scrollToProducts() {

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =================================
   PROMO CODE
================================= */

function copyPromo() {

    const promoCode = "FOOD30";

    navigator.clipboard.writeText(promoCode)
        .then(() => {

            alert(
                "Kode promo FOOD30 berhasil disalin! 🎉"
            );

        })
        .catch(() => {

            alert(
                "Kode promo: FOOD30"
            );

        });

}


/* =================================
   CHECKOUT
================================= */

function checkout() {

    if (cart.length === 0) {

        alert(
            "Keranjang kamu masih kosong 😅"
        );

        return;

    }


    let message =
        "Pesanan Foodify:%0A%0A";


    cart.forEach(item => {

        message +=
            `🍽️ ${item.name} x${item.quantity} - ${formatRupiah(item.price * item.quantity)}%0A`;

    });


    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );


    message +=
        `%0A💰 Total: ${formatRupiah(total)}`;


    alert(
        "Checkout berhasil dibuat! 🎉\n\n" +
        "Total pesanan: " +
        formatRupiah(total)
    );

}


/* =================================
   3D MOUSE EFFECT
================================= */

const foodCircle =
    document.querySelector(".food-circle");

document.addEventListener("mousemove", (event) => {

    if (window.innerWidth < 900) return;

    const x =
        (window.innerWidth / 2 - event.clientX) / 35;

    const y =
        (window.innerHeight / 2 - event.clientY) / 35;

    foodCircle.style.transform =
        `translateY(0) rotateY(${x}deg) rotateX(${y}deg)`;

});


/* =================================
   PRODUCT 3D TILT
================================= */

products.forEach(card => {

    card.addEventListener("mousemove", (event) => {

        if (window.innerWidth < 700) return;

        const rect =
            card.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;

        const rotateX =
            ((y - centerY) / centerY) * -4;

        const rotateY =
            ((x - centerX) / centerX) * 4;

        card.style.transform =
            `translateY(-10px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)`;

    });


    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});


/* =================================
   INITIALIZE
================================= */

updateCart();
