let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>
{
	searchForm.classList.toggle('active');
	shoppingCart.classList.remove('active');
	loginForm.classList.remove('active');
	navbar.classList.remove('active');
}


let shoppingCart = document.querySelector('.shopping-cart');

document.querySelector('#cart-btn').onclick = () =>
{
	searchForm.classList.remove('active');
	shoppingCart.classList.toggle('active');
	loginForm.classList.remove('active');
	navbar.classList.remove('active');
}


let loginForm = document.querySelector('.login-form');

document.querySelector('#login-btn').onclick = () =>
{
	searchForm.classList.remove('active');
	shoppingCart.classList.remove('active');
	loginForm.classList.toggle('active');
	navbar.classList.remove('active');

}
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>
{
	navbar.classList.toggle('active');
	searchForm.classList.remove('active');
	shoppingCart.classList.remove('active');
	loginForm.classList.remove('active');

}
window.onscroll = () =>
{
	
	searchForm.classList.remove('active');
	shoppingCart.classList.remove('active');
	loginForm.classList.remove('active');
	navbar.classList.remove('active');


}

const cartItems = new Map();
const cartItemsContainer = document.querySelector("#cart-items");
const cartEmptyMessage = document.querySelector("#cart-empty");
const cartTotal = document.querySelector("#cart-total");
const cartStatus = document.querySelector("#cart-status");
const productList = document.querySelector("#product-list");
const checkoutButton = document.querySelector("#checkout-btn");
const checkoutDialog = document.querySelector("#checkout-dialog");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutSummary = document.querySelector("#checkout-summary");
const checkoutStatus = document.querySelector("#checkout-status");
const addressStatus = document.querySelector("#address-status");
const savedAddressSelect = document.querySelector("#saved-addresses");
const saveAddressCheckbox = document.querySelector("#save-address");
const placeOrderButton = document.querySelector("#place-order-btn");
const addressStorageKey = "grocery-saved-addresses";
const addressFields = {
  name: document.querySelector("#checkout-name"),
  phone: document.querySelector("#checkout-phone"),
  street: document.querySelector("#checkout-street"),
  city: document.querySelector("#checkout-city"),
  state: document.querySelector("#checkout-state"),
  pincode: document.querySelector("#checkout-pincode"),
};
const paymentMethodLabels = {
  phonepe: "PhonePe",
  "google-pay": "Google Pay",
  paytm: "Paytm",
  card: "Credit/debit card",
};

function formatRupees(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function createQuantityControl(productId, quantity, className, productName) {
  const control = document.createElement("div");
  control.className = `quantity-control ${className}`;

  const decreaseButton = document.createElement("button");
  decreaseButton.type = "button";
  decreaseButton.dataset.productId = productId;
  decreaseButton.dataset.quantityChange = "-1";
  decreaseButton.setAttribute("aria-label", `Decrease ${productName} quantity`);
  decreaseButton.textContent = "-";

  const quantityValue = document.createElement("span");
  quantityValue.className = "quantity-value";
  quantityValue.setAttribute("aria-live", "polite");
  quantityValue.textContent = String(quantity);

  const increaseButton = document.createElement("button");
  increaseButton.type = "button";
  increaseButton.dataset.productId = productId;
  increaseButton.dataset.quantityChange = "1";
  increaseButton.setAttribute("aria-label", `Increase ${productName} quantity`);
  increaseButton.textContent = "+";

  control.append(decreaseButton, quantityValue, increaseButton);
  return control;
}

function updateProductCardControls() {
  productList.querySelectorAll(".product-slider .box").forEach((product) => {
    const addButton = product.querySelector(".btn");
    const name = product.querySelector("h1").textContent.trim();
    const productId = name.toLowerCase();
    const item = cartItems.get(productId);
    let quantityControl = product.querySelector(".product-quantity-control");

    addButton.classList.add("add-to-cart");
    if (!quantityControl) {
      quantityControl = createQuantityControl(
        productId,
        item ? item.quantity : 0,
        "product-quantity-control",
        name
      );
      addButton.after(quantityControl);
    }

    addButton.hidden = Boolean(item);
    quantityControl.hidden = !item;
    quantityControl.querySelector(".quantity-value").textContent = String(
      item ? item.quantity : 0
    );
  });
}

function renderShoppingCart() {
  cartItemsContainer.replaceChildren();
  let total = 0;

  cartItems.forEach((item, productId) => {
    total += item.price * item.quantity;

    const box = document.createElement("div");
    box.className = "box";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "fa fa-trash";
    removeButton.dataset.removeProduct = productId;
    removeButton.setAttribute("aria-label", `Remove ${item.name} from cart`);

    const content = document.createElement("div");
    content.className = "content";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = item.unitPrice;

    const quantityControl = createQuantityControl(
      productId,
      item.quantity,
      "cart-quantity-control",
      item.name
    );

    content.append(name, price, quantityControl);
    box.append(removeButton, content);
    cartItemsContainer.append(box);
  });

  cartTotal.textContent = `Total: ${formatRupees(total)}`;
  cartEmptyMessage.hidden = cartItems.size > 0;
  checkoutButton.hidden = cartItems.size === 0;
  checkoutButton.disabled = cartItems.size === 0;
  updateProductCardControls();
}

function changeCartQuantity(productId, change) {
  const item = cartItems.get(productId);
  if (!item) {
    return;
  }

  const newQuantity = item.quantity + change;
  if (newQuantity <= 0) {
    cartItems.delete(productId);
  } else {
    item.quantity = newQuantity;
  }

  renderShoppingCart();
  cartStatus.textContent = newQuantity <= 0
    ? `${item.name} removed from your cart.`
    : `${item.name} quantity updated to ${newQuantity}.`;
}

productList.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity-change]");
  if (quantityButton) {
    event.preventDefault();
    changeCartQuantity(
      quantityButton.dataset.productId,
      Number(quantityButton.dataset.quantityChange)
    );
    return;
  }

  const addButton = event.target.closest(".product-slider .box .add-to-cart");
  if (!addButton) {
    return;
  }

  event.preventDefault();
  const product = addButton.closest(".box");
  const name = product.querySelector("h1").textContent.trim();
  const priceText = product.querySelector(".price").textContent.trim();
  const priceMatch = priceText.match(/₹\s*([\d,]+)/);

  if (!priceMatch) {
    cartStatus.textContent = `Unable to add ${name}: its price could not be read.`;
    return;
  }

  const productId = name.toLowerCase();
  const existingItem = cartItems.get(productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const image = product.querySelector("img");
    cartItems.set(productId, {
      name,
      image: image.getAttribute("src"),
      imageAlt: image.alt,
      unitPrice: priceText,
      price: Number(priceMatch[1].replace(/,/g, "")),
      quantity: 1,
    });
  }

  renderShoppingCart();
  cartStatus.textContent = `${name} added to your cart. Quantity: ${cartItems.get(productId).quantity}.`;
});

cartItemsContainer.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity-change]");
  if (quantityButton) {
    changeCartQuantity(
      quantityButton.dataset.productId,
      Number(quantityButton.dataset.quantityChange)
    );
    return;
  }

  const removeButton = event.target.closest("[data-remove-product]");
  if (!removeButton) {
    return;
  }

  const productId = removeButton.dataset.removeProduct;
  const removedItem = cartItems.get(productId);
  cartItems.delete(productId);
  renderShoppingCart();
  cartStatus.textContent = `${removedItem.name} removed from your cart.`;
});

function isSavedAddress(value) {
  return value && typeof value === "object" &&
    Object.keys(addressFields).every((key) => typeof value[key] === "string");
}

function readSavedAddresses() {
  try {
    const savedAddresses = window.localStorage.getItem(addressStorageKey);
    const addresses = savedAddresses ? JSON.parse(savedAddresses) : [];
    if (!Array.isArray(addresses) || !addresses.every(isSavedAddress)) {
      addressStatus.textContent = "Saved addresses could not be loaded. Please enter your address again.";
      return [];
    }
    return addresses;
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof DOMException) {
      addressStatus.textContent = "Saved addresses could not be loaded. Please enter your address again.";
      return [];
    }
    throw error;
  }
}

let savedAddresses = readSavedAddresses();

function renderSavedAddresses() {
  savedAddressSelect.replaceChildren(new Option("Enter a new address", ""));
  savedAddresses.forEach((address, index) => {
    const option = new Option(
      `${address.name} — ${address.street}, ${address.city} ${address.pincode}`,
      String(index)
    );
    savedAddressSelect.append(option);
  });
}

function getAddressFromForm() {
  return Object.fromEntries(
    Object.entries(addressFields).map(([key, field]) => [key, field.value.trim()])
  );
}

function saveAddress(address) {
  const alreadySaved = savedAddresses.some((savedAddress) =>
    Object.keys(addressFields).every((key) => savedAddress[key] === address[key])
  );
  const nextAddresses = alreadySaved
    ? savedAddresses
    : [...savedAddresses, address];

  try {
    window.localStorage.setItem(addressStorageKey, JSON.stringify(nextAddresses));
  } catch (error) {
    if (error instanceof DOMException) {
      addressStatus.textContent = "This address could not be saved on this device. You can still place the order.";
      return false;
    }
    throw error;
  }

  savedAddresses = nextAddresses;
  renderSavedAddresses();
  savedAddressSelect.value = String(
    savedAddresses.findIndex((savedAddress) =>
      Object.keys(addressFields).every((key) => savedAddress[key] === address[key])
    )
  );
  addressStatus.textContent = "Address saved on this device.";
  return true;
}

renderSavedAddresses();
renderShoppingCart();

document.querySelector("#checkout-close").addEventListener("click", () => {
  checkoutDialog.close();
});

checkoutButton.addEventListener("click", () => {
  if (cartItems.size === 0) {
    cartStatus.textContent = "Add an item to your cart before checking out.";
    return;
  }

  const itemCount = Array.from(cartItems.values()).reduce(
    (total, item) => total + item.quantity,
    0
  );
  checkoutSummary.textContent = `${itemCount} item${itemCount === 1 ? "" : "s"} · ${cartTotal.textContent}`;
  checkoutStatus.textContent = "";
  placeOrderButton.disabled = false;
  placeOrderButton.textContent = "Place order";
  checkoutDialog.showModal();
});

savedAddressSelect.addEventListener("change", () => {
  const address = savedAddresses[Number(savedAddressSelect.value)];
  Object.entries(addressFields).forEach(([key, field]) => {
    field.value = address ? address[key] : "";
  });
  addressStatus.textContent = "";
});

checkoutForm.addEventListener("change", (event) => {
  const paymentInput = event.target.closest('input[name="payment-method"]');
  if (!paymentInput) {
    return;
  }

  checkoutStatus.textContent = paymentInput.value === "cod"
    ? ""
    : `${paymentMethodLabels[paymentInput.value]} is not connected yet. Choose Cash on Delivery; no online payment will be taken.`;
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (cartItems.size === 0) {
    checkoutStatus.textContent = "Your cart is empty. Add items before placing an order.";
    return;
  }

  const paymentMethod = checkoutForm.querySelector(
    'input[name="payment-method"]:checked'
  ).value;
  if (paymentMethod !== "cod") {
    checkoutStatus.textContent = `${paymentMethodLabels[paymentMethod]} is not connected yet. No payment or order was submitted. Choose Cash on Delivery.`;
    return;
  }

  if (saveAddressCheckbox.checked) {
    saveAddress(getAddressFromForm());
  }

  const total = Array.from(cartItems.values()).reduce(
    (amount, item) => amount + item.price * item.quantity,
    0
  );
  const totalItems = Array.from(cartItems.values()).reduce(
    (quantity, item) => quantity + item.quantity,
    0
  );
  checkoutStatus.textContent = `Demo COD checkout complete for ${totalItems} item${totalItems === 1 ? "" : "s"} (${formatRupees(total)}). No order has been sent to the store.`;
  cartItems.clear();
  renderShoppingCart();
  cartStatus.textContent = "Demo checkout complete; no order has been sent to the store.";
  placeOrderButton.disabled = true;
  placeOrderButton.textContent = "Order recorded (demo)";
});


const productSwiperOptions = {
  loop: true,
  spaceBetween: 20,
  autoplay: {
    delay: 7500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 4,
    },
    768: {
      slidesPerView: 2,
    },
    1020: {
      slidesPerView: 3,
    },
  },
};

const productSliderElements = Array.from(document.querySelectorAll(".product-slider"));
const productSliderWrappers = productSliderElements.map(
  (slider) => slider.querySelector(".swiper-wrapper")
);
let productSwipers = productSliderElements.map(
  (slider) => new Swiper(slider, productSwiperOptions)
);
const productsSection = document.querySelector("#products");

function showProductsForCategory(category, label) {
  let visibleProductCount = 0;

  if (category !== "all") {
    productSwipers.forEach((swiper) => swiper.destroy(true, true));
    productSwipers = [];
    productsSection.classList.add("category-filtered");
  } else {
    productsSection.classList.remove("category-filtered");
  }

  productSliderElements.forEach((slider, index) => {
    slider.classList.add("swiper");
    productSliderWrappers[index].classList.add("swiper-wrapper");
    slider.hidden = false;
    let visibleSlideCount = 0;
    slider.querySelectorAll(".box").forEach((slide) => {
      slide.classList.add("swiper-slide");
      const isVisible = category === "all" || slide.dataset.category === category;
      slide.hidden = !isVisible;
      if (isVisible) {
        visibleSlideCount += 1;
        visibleProductCount += 1;
      }
    });

    slider.hidden = visibleSlideCount === 0;
  });

  if (category === "all") {
    productSwipers = productSliderElements.map(
      (slider) => new Swiper(slider, productSwiperOptions)
    );
  }

  const filterControls = document.querySelector("#product-filter-controls");
  const filterLabel = document.querySelector("#product-filter-label");
  const emptyMessage = document.querySelector("#no-category-products");
  filterControls.hidden = category === "all";
  filterLabel.textContent = `Showing ${label}`;
  emptyMessage.hidden = visibleProductCount > 0;
  emptyMessage.textContent = visibleProductCount > 0
    ? ""
    : `No ${label.toLowerCase()} products are available yet.`;
}

document.querySelectorAll("[data-product-category]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const categoryName = link.closest(".box").querySelector("h3").textContent.trim();
    showProductsForCategory(link.dataset.productCategory, categoryName);
    window.history.replaceState(null, "", "#products");
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector("#show-all-products").addEventListener("click", () => {
  showProductsForCategory("all", "all products");
});

    var swiper = new Swiper(".review-slider", {
      loop:true,
      spaceBetween: 20,

     autoplay:{
     	delay:7500,
     	disableOnInteraction: false,
     },


   
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 4,
        },
        768: {
          slidesPerView: 2,
         
        },
        1020: {
          slidesPerView: 3,
     
        },
      },
    });