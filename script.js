
/* =========================================
   ESSMASS ENTERPRISE
   Shopping and Ordering System
========================================= */

/*
  IMPORTANT:
  Replace this sample number with your brother's
  WhatsApp number, including Ghana's country code.
  Example format: 233241234567
  Do not include +, spaces or hyphens.
*/
const SHOP_WHATSAPP = "233XXXXXXXXX";

/*
  These are DEMONSTRATION products and prices.
  Replace them with the actual products and prices
  confirmed by ESSMASS ENTERPRISE.
*/
const products = [
    {
        id: 1,
        name: "6-Inch Concrete Block",
        category: "blocks",
        description: "Concrete block for wall construction.",
        price: 8.00,
        unit: "per block",
        tag: "Popular",
        image: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "5-Inch Concrete Block",
        category: "blocks",
        description: "Block for suitable building applications.",
        price: 7.00,
        unit: "per block",
        tag: "Blocks",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Standard Cement Bag",
        category: "cement",
        description: "Cement for masonry and construction.",
        price: 100.00,
        unit: "per bag",
        tag: "Cement",
        image: "https://images.unsplash.com/photo-1513467655676-561b7d489a88?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "PVC Water Pipe",
        category: "plumbing",
        description: "PVC pipe. Confirm diameter and length.",
        price: 45.00,
        unit: "per piece",
        tag: "Plumbing",
        image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "PVC Pipe Elbow",
        category: "plumbing",
        description: "Pipe elbow fitting. Confirm size.",
        price: 8.00,
        unit: "per piece",
        tag: "Plumbing",
        image: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "PVC Pipe Connector",
        category: "plumbing",
        description: "Pipe connector for plumbing work.",
        price: 6.00,
        unit: "per piece",
        tag: "Plumbing",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Plumbing Tap",
        category: "plumbing",
        description: "Water tap. Confirm type and finish.",
        price: 55.00,
        unit: "per piece",
        tag: "Plumbing",
        image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Wheelbarrow",
        category: "other",
        description: "For moving materials around the site.",
        price: 450.00,
        unit: "per piece",
        tag: "Equipment",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 9,
        name: "Construction Shovel",
        category: "other",
        description: "Hand tool for general site work.",
        price: 85.00,
        unit: "per piece",
        tag: "Tools",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 10,
        name: "Concrete Building Blocks",
        category: "blocks",
        description: "Order blocks in your required quantity.",
        price: 8.00,
        unit: "per block",
        tag: "Bulk Orders",
        image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 11,
        name: "Plumbing Pipe Fittings",
        category: "plumbing",
        description: "Ask about available sizes and fittings.",
        price: 12.00,
        unit: "per piece",
        tag: "Plumbing",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 12,
        name: "Construction Safety Helmet",
        category: "other",
        description: "Safety equipment for construction work.",
        price: 95.00,
        unit: "per piece",
        tag: "Safety",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80"
    }
];

const categoryNames = {
    blocks: "Concrete Blocks",
    cement: "Cement",
    plumbing: "Plumbing",
    other: "Other Supplies"
};

const cart = new Map();

let activeCategory = "all";
let searchTerm = "";
let toastTimer;

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const checkoutModal = document.getElementById("checkoutModal");
const toast = document.getElementById("toast");

function money(amount) {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };
        return entities[character];
    });
}

function getProduct(id) {
    return products.find(product => product.id === Number(id));
}

function getCartQuantity() {
    let quantity = 0;

    cart.forEach(item => {
        quantity += item.quantity;
    });

    return quantity;
}

function getCartTotal() {
    let total = 0;

    cart.forEach(item => {
        const product = getProduct(item.id);

        if (product) {
            total += product.price * item.quantity;
        }
    });

    return total;
}

function getCategoryLabel(category) {
    return categoryNames[category] || "Building Materials";
}

/* =========================================
   PRODUCT DISPLAY
========================================= */

function renderProducts() {
    let filteredProducts = products.filter(product => {
        const matchesCategory =
            activeCategory === "all" ||
            product.category === activeCategory;

        const searchableText = [
            product.name,
            product.description,
            product.category,
            getCategoryLabel(product.category)
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    const sortValue = document.getElementById("sortProducts").value;

    if (sortValue === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    document.getElementById("resultsMessage").textContent =
        `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"} found`;

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>Try another product name or choose a different category.</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-image-wrap">
                <img
                    class="product-image"
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400/eaf2fc/123b70?text=ESSMASS+ENTERPRISE'">
                <span class="product-tag">${escapeHTML(product.tag)}</span>
            </div>

            <div class="product-details">
                <span class="product-category">
                    ${escapeHTML(getCategoryLabel(product.category))}
                </span>

                <h3>${escapeHTML(product.name)}</h3>
                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-price">
                    ${money(product.price)}
                    <span class="product-unit">/ ${escapeHTML(product.unit.replace(/^per /, ""))}</span>
                </div>

                <div class="product-actions">
                    <input
                        class="quantity-input"
                        type="number"
                        min="1"
                        max="100000"
                        step="1"
                        value="1"
                        aria-label="Quantity for ${escapeHTML(product.name)}"
                        data-quantity="${product.id}">

                    <button
                        type="button"
                        class="add-cart-btn"
                        data-add="${product.id}">
                        + Add to Cart
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

/* =========================================
   CATEGORY FILTERS AND SEARCH
========================================= */

function setCategory(category) {
    activeCategory = category;

    document.querySelectorAll(".filter-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === category
        );
    });

    renderProducts();
}

document.getElementById("filterButtons").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (button) {
        setCategory(button.dataset.category);
    }
});

document.getElementById("categoryGrid").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (button) {
        setCategory(button.dataset.category);
        document.getElementById("shop").scrollIntoView({
            behavior: "smooth"
        });
    }
});

document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();

    searchTerm = document.getElementById("searchInput")
        .value.trim().toLowerCase();

    renderProducts();

    document.getElementById("shop").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("searchInput").addEventListener("input", event => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderProducts();
});

document.getElementById("sortProducts").addEventListener("change", renderProducts);

/* =========================================
   SHOPPING CART
========================================= */

function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function addToCart(productId, quantity) {
    const product = getProduct(productId);

    if (!product) return;

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000) {
        showToast("Please enter a valid quantity.");
        return;
    }

    const currentQuantity = cart.has(product.id)
        ? cart.get(product.id).quantity
        : 0;

    if (currentQuantity + quantity > 100000) {
        showToast("Please contact us for this quantity.");
        return;
    }

    cart.set(product.id, {
        id: product.id,
        quantity: currentQuantity + quantity
    });

    renderCart();
    showToast(`${product.name} added to your cart.`);
}

function changeCartQuantity(productId, change) {
    const item = cart.get(Number(productId));

    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        cart.delete(Number(productId));
    } else if (newQuantity <= 100000) {
        item.quantity = newQuantity;
        cart.set(Number(productId), item);
    } else {
        showToast("Please contact us for larger orders.");
    }

    renderCart();
}

function removeFromCart(productId) {
    cart.delete(Number(productId));
    renderCart();
}

function renderCart() {
    cartCount.textContent = getCartQuantity();

    const total = getCartTotal();
    cartSubtotal.textContent = money(total);
    checkoutSubtotal.textContent = money(total);

    if (cart.size === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div style="font-size:38px;margin-bottom:12px;">🛒</div>
                <h3>Your cart is empty</h3>
                <p style="margin-top:8px;">Add building materials to start an order.</p>
            </div>
        `;

        return;
    }

    cartItems.innerHTML = Array.from(cart.values()).map(item => {
        const product = getProduct(item.id);

        if (!product) return "";

        return `
            <div class="cart-item">
                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.onerror=null;this.src='https://placehold.co/100x100/eaf2fc/123b70?text=Product'">

                <div>
                    <h3>${escapeHTML(product.name)}</h3>
                    <small>${money(product.price)} / ${escapeHTML(product.unit.replace(/^per /, ""))}</small>

                    <div class="cart-quantity">
                        <button type="button" data-minus="${product.id}" aria-label="Decrease quantity">−</button>
                        <span>${item.quantity}</span>
                        <button type="button" data-plus="${product.id}" aria-label="Increase quantity">+</button>
                    </div>

                    <div class="cart-item-price">
                        ${money(product.price * item.quantity)}
                    </div>
                </div>

                <button
                    class="remove-item"
                    type="button"
                    data-remove="${product.id}">
                    Remove
                </button>
            </div>
        `;
    }).join("");
}

productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    const productId = Number(button.dataset.add);
    const quantityInput = productGrid.querySelector(
        `[data-quantity="${productId}"]`
    );

    const quantity = Number(quantityInput.value);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000) {
        showToast("Enter a whole-number quantity between 1 and 100000.");
        quantityInput.focus();
        return;
    }

    addToCart(productId, quantity);
});

cartItems.addEventListener("click", event => {
    const plusButton = event.target.closest("[data-plus]");
    const minusButton = event.target.closest("[data-minus]");
    const removeButton = event.target.closest("[data-remove]");

    if (plusButton) {
        changeCartQuantity(plusButton.dataset.plus, 1);
    } else if (minusButton) {
        changeCartQuantity(minusButton.dataset.minus, -1);
    } else if (removeButton) {
        removeFromCart(removeButton.dataset.remove);
    }
});

/* =========================================
   CART DRAWER
========================================= */

function openCart() {
    cartDrawer.classList.add("open");
    drawerBackdrop.classList.add("visible");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    document.getElementById("closeCart").focus();
}

function closeCart() {
    cartDrawer.classList.remove("open");
    drawerBackdrop.classList.remove("visible");
    cartDrawer.setAttribute("aria-hidden", "true");

    if (!checkoutModal.classList.contains("visible")) {
        document.body.classList.remove("no-scroll");
    }
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);

/* =========================================
   CHECKOUT
========================================= */

function openCheckout() {
    if (cart.size === 0) {
        showToast("Please add products to your cart first.");
        return;
    }

    closeCart();

    checkoutSubtotal.textContent = money(getCartTotal());
    checkoutModal.classList.add("visible");
    checkoutModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    document.getElementById("checkoutTitle").scrollIntoView({
        behavior: "auto",
        block: "nearest"
    });
}

function closeCheckout() {
    checkoutModal.classList.remove("visible");
    checkoutModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
}

document.getElementById("checkoutButton").addEventListener("click", openCheckout);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);

checkoutModal.addEventListener("click", event => {
    if (event.target === checkoutModal) {
        closeCheckout();
    }
});

document.getElementById("fulfilmentSelect").addEventListener("change", event => {
    const isDelivery = event.target.value === "Delivery";
    const addressField = document.getElementById("addressField");
    const addressInput = document.getElementById("deliveryAddress");

    addressField.style.display = isDelivery ? "grid" : "none";
    addressInput.required = isDelivery;

    if (!isDelivery) {
        addressInput.value = "";
    }
});

function getWhatsAppURL(message) {
    if (!/^233\d{9}$/.test(SHOP_WHATSAPP)) {
        showToast("Please configure the shop's WhatsApp number in script.js.");
        return null;
    }

    return "https://wa.me/" + SHOP_WHATSAPP +
        "?text=" + encodeURIComponent(message);
}

function buildOrderMessage(formData) {
    const orderReference = "ESS-" + Date.now().toString().slice(-8);

    const lines = [
        "NEW ORDER REQUEST - ESSMASS ENTERPRISE",
        "Order reference: " + orderReference,
        "",
        "CUSTOMER DETAILS",
        "Name: " + formData.get("customerName").trim(),
        "Phone: " + formData.get("phone").trim(),
        "Order type: " + formData.get("orderType"),
        "Fulfilment: " + formData.get("fulfilment")
    ];

    if (formData.get("fulfilment") === "Delivery") {
        lines.push("Delivery address: " + formData.get("address").trim());
    }

    lines.push("", "ORDER ITEMS");

    cart.forEach(item => {
        const product = getProduct(item.id);

        if (product) {
            lines.push(
                "- " + product.name +
                " x " + item.quantity +
                " (" + product.unit + ")" +
                " = " + money(product.price * item.quantity)
            );
        }
    });

    lines.push(
        "",
        "Estimated subtotal: " + money(getCartTotal()),
        "Delivery charge: To be confirmed",
        "",
        "Additional instructions: " +
            (formData.get("notes").trim() || "None"),
        "",
        "Please confirm product availability, current prices, delivery charges and final total. Thank you."
    );

    return lines.join("\n");
}

document.getElementById("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();

    if (cart.size === 0) {
        showToast("Your cart is empty.");
        closeCheckout();
        return;
    }

    const form = event.currentTarget;

    if (!form.reportValidity()) {
        return;
    }

    const formData = new FormData(form);

    if (formData.get("fulfilment") === "Delivery" &&
        !String(formData.get("address") || "").trim()) {
        showToast("Please enter your delivery address.");
        return;
    }

    const message = buildOrderMessage(formData);
    const whatsappURL = getWhatsAppURL(message);

    if (!whatsappURL) return;

    // Open WhatsApp only after the customer submits the form.
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

/* =========================================
   CONTACT WHATSAPP BUTTON
========================================= */

document.getElementById("contactWhatsApp").addEventListener("click", event => {
    event.preventDefault();

    const message =
        "Hello ESSMASS ENTERPRISE. I am interested in your building materials. " +
        "Please share your current prices and availability.";

    const whatsappURL = getWhatsAppURL(message);

    if (whatsappURL) {
        window.open(whatsappURL, "_blank", "noopener,noreferrer");
    }
});

/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

/* =========================================
   ESCAPE KEY AND INITIAL DISPLAY
========================================= */

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        closeCheckout();
    }
});

document.getElementById("currentYear").textContent =
    new Date().getFullYear();

renderProducts();
renderCart();
