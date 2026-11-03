
/* =========================================
   PROVISION HUB - SHOPPING SYSTEM
   HTML + CSS + JAVASCRIPT PROTOTYPE
========================================= */

// IMPORTANT:
// Replace this placeholder with your business WhatsApp number.
// Ghana example: 233241234567
// Do not include +, spaces or dashes.
const WHATSAPP_NUMBER = "233242364313";

const money = amount =>
    new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2
    }).format(amount);

// Sample products: change prices and images to match your stock.
// wholesaleMin is the minimum quantity that qualifies for wholesale.
// Prices are illustrative, not live supplier prices.

const products = [
    {
        id: 1,
        name: "Premium Rice",
        category: "Rice & Grains",
        unit: "1 kg bag",
        price: 22,
        wholesalePrice: 19,
        wholesaleMin: 10,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Cooking Oil",
        category: "Cooking Essentials",
        unit: "1 litre bottle",
        price: 28,
        wholesalePrice: 25,
        wholesaleMin: 12,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Powdered Milk",
        category: "Drinks & Dairy",
        unit: "400 g tin",
        price: 48,
        wholesalePrice: 44,
        wholesaleMin: 6,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Tomato Paste",
        category: "Canned Foods",
        unit: "1 tin",
        price: 8,
        wholesalePrice: 6.8,
        wholesaleMin: 24,
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Spaghetti",
        category: "Rice & Grains",
        unit: "500 g pack",
        price: 12,
        wholesalePrice: 10,
        wholesaleMin: 12,
        image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Bottled Water",
        category: "Drinks & Dairy",
        unit: "1 bottle",
        price: 4,
        wholesalePrice: 3,
        wholesaleMin: 24,
        image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Bathing Soap",
        category: "Home & Personal Care",
        unit: "1 bar",
        price: 8,
        wholesalePrice: 6.5,
        wholesaleMin: 12,
        image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Laundry Detergent",
        category: "Home & Personal Care",
        unit: "1 pack",
        price: 18,
        wholesalePrice: 15,
        wholesaleMin: 10,
        image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 9,
        name: "Granulated Sugar",
        category: "Rice & Grains",
        unit: "1 kg bag",
        price: 18,
        wholesalePrice: 15,
        wholesaleMin: 10,
        image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 10,
        name: "Breakfast Biscuits",
        category: "Snacks & Biscuits",
        unit: "1 pack",
        price: 5,
        wholesalePrice: 4,
        wholesaleMin: 24,
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 11,
        name: "Canned Sardines",
        category: "Canned Foods",
        unit: "1 tin",
        price: 12,
        wholesalePrice: 10,
        wholesaleMin: 12,
        image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 12,
        name: "Malt Drink",
        category: "Drinks & Dairy",
        unit: "1 bottle",
        price: 9,
        wholesalePrice: 7.5,
        wholesaleMin: 24,
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80"
    }
];

const categoryIcons = {
    "Rice & Grains": "🌾",
    "Cooking Essentials": "🫒",
    "Drinks & Dairy": "🥛",
    "Canned Foods": "🥫",
    "Home & Personal Care": "🧼",
    "Snacks & Biscuits": "🍪"
};

// Current page state
let selectedCategory = "All";
let searchTerm = "";
let cart = loadCart();
let cardQuantities = {};

// Safe cart loading
function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem("provisionHubCart"));

        if (!Array.isArray(saved)) return [];

        return saved.filter(item => {
            return products.some(product => product.id === item.id) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0 &&
                item.quantity <= 10000;
        });
    } catch {
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem("provisionHubCart", JSON.stringify(cart));
    } catch {
        showToast("Your browser could not save the cart.");
    }
}

function getProduct(id) {
    return products.find(product => product.id === id);
}

function getCartItem(id) {
    return cart.find(item => item.id === id);
}

// Wholesale price applies to all units of a product
// once its individual minimum quantity is reached.
function unitPrice(product, quantity) {
    return quantity >= product.wholesaleMin
        ? product.wholesalePrice
        : product.price;
}

function lineTotal(product, quantity) {
    return unitPrice(product, quantity) * quantity;
}

function cartSubtotal() {
    return cart.reduce((total, item) => {
        const product = getProduct(item.id);
        return product
            ? total + lineTotal(product, item.quantity)
            : total;
    }, 0);
}

function cartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Build categories
function renderCategories() {
    const grid = document.getElementById("categoryGrid");
    const filter = document.getElementById("categoryFilter");

    const categories = [...new Set(products.map(p => p.category))];

    grid.innerHTML = "";

    categories.forEach(category => {
        const button = document.createElement("button");
        button.type = "button";
        button.className =
            "category-card" +
            (selectedCategory === category ? " active" : "");

        const icon = document.createElement("span");
        icon.className = "category-icon";
        icon.textContent = categoryIcons[category] || "🛍️";

        const name = document.createElement("strong");
        name.textContent = category;

        button.append(icon, name);
        button.addEventListener("click", () => {
            selectedCategory =
                selectedCategory === category ? "All" : category;

            filter.value = selectedCategory;
            renderCategories();
            renderProducts();
            document.getElementById("shop").scrollIntoView({
                behavior: "smooth"
            });
        });

        grid.appendChild(button);
    });

    filter.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "All";
    allOption.textContent = "All products";
    filter.appendChild(allOption);

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        filter.appendChild(option);
    });

    filter.value = selectedCategory;
}

// Build product cards
function renderProducts() {
    const grid = document.getElementById("productGrid");
    const emptyMessage = document.getElementById("emptyMessage");

    grid.innerHTML = "";

    const filtered = products.filter(product => {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesSearch =
            `${product.name} ${product.category} ${product.unit}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    emptyMessage.hidden = filtered.length !== 0;

    filtered.forEach(product => {
        const quantity = cardQuantities[product.id] || 1;

        const card = document.createElement("article");
        card.className = "product-card";

        const photo = document.createElement("div");
        photo.className = "product-photo";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.onerror = () => {
            image.onerror = null;
            image.src =
                "https://placehold.co/600x600/f3f4ef/176b43?text=Provision";
        };

        const tag = document.createElement("span");
        tag.className = "product-tag";
        tag.textContent = "In stock";

        photo.append(image, tag);

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const priceRow = document.createElement("div");
        priceRow.className = "price-row";

        const price = document.createElement("span");
        price.className = "retail-price";
        price.textContent = money(product.price);

        const unit = document.createElement("span");
        unit.className = "unit-label";
        unit.textContent = `/ ${product.unit}`;

        priceRow.append(price, unit);

        const wholesale = document.createElement("p");
        wholesale.className = "wholesale-price";
        wholesale.textContent =
            `${money(product.wholesalePrice)} wholesale `;

        const minimum = document.createElement("span");
        minimum.className = "minimum-label";
        minimum.textContent =
            `(from ${product.wholesaleMin} units)`;

        wholesale.appendChild(minimum);

        const quantityRow = document.createElement("div");
        quantityRow.className = "quantity-row";

        const quantityControl = document.createElement("div");
        quantityControl.className = "quantity-control";

        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        minus.setAttribute("aria-label", `Decrease ${product.name} quantity`);

        const quantityDisplay = document.createElement("span");
        quantityDisplay.textContent = quantity;

        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        plus.setAttribute("aria-label", `Increase ${product.name} quantity`);

        minus.addEventListener("click", () => {
            cardQuantities[product.id] = Math.max(1, quantity - 1);
            renderProducts();
        });

        plus.addEventListener("click", () => {
            if (quantity >= 10000) {
                showToast("Maximum quantity reached.");
                return;
            }

            cardQuantities[product.id] = quantity + 1;
            renderProducts();
        });

        quantityControl.append(minus, quantityDisplay, plus);

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "add-button";
        addButton.textContent = "Add to Cart";

        addButton.addEventListener("click", () => {
            addToCart(product.id, quantity);
        });

        quantityRow.append(quantityControl, addButton);
        info.append(category, name, priceRow, wholesale, quantityRow);
        card.append(photo, info);
        grid.appendChild(card);
    });
}

// Cart operations
function addToCart(id, quantity) {
    const existing = getCartItem(id);
    const currentQuantity = existing ? existing.quantity : 0;

    if (currentQuantity + quantity > 10000) {
        showToast("Maximum quantity reached.");
        return;
    }

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id, quantity });
    }

    saveCart();
    renderCart();
    showToast(`${getProduct(id).name} added to your cart.`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function renderCart() {
    const itemsContainer = document.getElementById("cartItems");

    itemsContainer.innerHTML = "";

    document.getElementById("cartCount").textContent = cartItemCount();
    document.getElementById("cartSubtotal").textContent =
        money(cartSubtotal());

    document.getElementById("checkoutSubtotal").textContent =
        money(cartSubtotal());

    if (cart.length === 0) {
        const empty = document.createElement("p");
        empty.className = "cart-empty";
        empty.textContent = "Your cart is empty. Add some provisions to get started.";
        itemsContainer.appendChild(empty);
        return;
    }

    cart.forEach(item => {
        const product = getProduct(item.id);
        if (!product) return;

        const row = document.createElement("div");
        row.className = "cart-item";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent =
            `${item.quantity} × ${money(unitPrice(product, item.quantity))}`;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-item";
        remove.textContent = "Remove";
        remove.addEventListener("click", () => removeFromCart(item.id));

        details.append(name, price, remove);

        const total = document.createElement("strong");
        total.textContent = money(lineTotal(product, item.quantity));
        total.style.fontSize = "12px";

        row.append(image, details, total);
        itemsContainer.appendChild(row);
    });
}

// Cart drawer
function openCart() {
    document.getElementById("cartDrawer").classList.add("open");
    document.getElementById("overlay").classList.add("visible");
    document.body.classList.add("no-scroll");
}

function closeCart() {
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("overlay").classList.remove("visible");

    if (document.getElementById("checkoutModal").hidden) {
        document.body.classList.remove("no-scroll");
    }
}

// Checkout window
function openCheckout() {
    if (cart.length === 0) {
        showToast("Your cart is empty.");
        return;
    }

    document.getElementById("checkoutModal").hidden = false;
    document.getElementById("overlay").classList.add("visible");
    document.body.classList.add("no-scroll");
}

function closeCheckout() {
    document.getElementById("checkoutModal").hidden = true;
    document.getElementById("overlay").classList.remove("visible");
    document.body.classList.remove("no-scroll");
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

// Search
document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();

    searchTerm = document.getElementById("searchInput").value.trim();
    renderProducts();

    document.getElementById("shop").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("searchInput").addEventListener("input", event => {
    searchTerm = event.target.value.trim();
    renderProducts();
});

document.getElementById("categoryFilter").addEventListener("change", event => {
    selectedCategory = event.target.value;
    renderCategories();
    renderProducts();
});

// Buttons and overlay
document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", () => {
    closeCart();
    closeCheckout();
});

document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your cart is empty.");
        return;
    }

    closeCart();
    openCheckout();
});

document.getElementById("closeCheckout").addEventListener("click", closeCheckout);

// Send order details to WhatsApp
document.getElementById("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        showToast("Your cart is empty.");
        closeCheckout();
        return;
    }

    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
        showToast("Set your real WhatsApp number in script.js first.");
        return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const customerName = String(formData.get("customerName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const orderType = String(formData.get("orderType") || "");
    const notes = String(formData.get("notes") || "").trim();

    if (!customerName || !phone || !address) {
        showToast("Please complete your delivery details.");
        return;
    }

    const lines = [
        "NEW PROVISION ORDER",
        "--------------------------",
        `Name: ${customerName}`,
        `Phone: ${phone}`,
        `Delivery address: ${address}`,
        `Order type: ${orderType}`,
        "",
        "ORDER ITEMS:"
    ];

    cart.forEach(item => {
        const product = getProduct(item.id);
        if (!product) return;

        lines.push(
            `${product.name} - ${item.quantity} x ${money(unitPrice(product, item.quantity))} = ${money(lineTotal(product, item.quantity))}`
        );

        if (item.quantity >= product.wholesaleMin) {
            lines.push(`  Wholesale price applied; minimum ${product.wholesaleMin} units.`);
        }
    });

    lines.push(
        "",
        `PRODUCT SUBTOTAL: ${money(cartSubtotal())}`,
        "Delivery fee: To be confirmed",
        `Instructions: ${notes || "None"}`,
        "",
        "Please confirm stock, delivery fee and final order total."
    );

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;

    // Opens WhatsApp; the customer must press Send there.
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

// Keyboard support
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        closeCheckout();
    }
});

// Start the shop
document.getElementById("year").textContent = new Date().getFullYear();

renderCategories();
renderProducts();
renderCart();
