# Grocery-Management-System
# 🛒 Grocery Management App

A modern, responsive grocery shopping website built using **HTML, CSS, and JavaScript**, designed to provide users with a smooth and convenient online grocery shopping experience.

The application allows users to browse grocery products, search and filter items, manage their shopping cart, and complete a demo checkout. It also includes Firebase Authentication for secure user sign-up and login.

## ✨ Features

### 🏠 User Interface
- Responsive homepage design
- Mobile-friendly navigation menu
- Modern and user-friendly layout
- Product and customer review carousels using Swiper.js

### 🥦 Product Management
- Browse grocery products
- Product search functionality
- Category-based filtering
- Multiple grocery categories:
  - Fruits
  - Vegetables
  - Dairy Products
  - Meat

### 🛍️ Shopping Cart
- Add products to the cart
- Increase or decrease product quantities
- Remove products from the cart
- Automatic subtotal and total calculation
- Real-time cart updates

### 💳 Checkout
- Checkout form with delivery address validation
- Save delivery addresses using Local Storage
- Multiple payment options
- Cash on Delivery demo checkout

### 🔐 User Authentication
- User registration
- User login
- Firebase Email/Password Authentication
- Password reset functionality
- Signed-in navigation state

## 📄 Project Structure

```text
Grocery-Management-App/
│
├── index.html
├── login.html
├── user.html
│
├── script.js
├── auth.js
├── home-auth.js
├── firebase.js
│
├── style.css
├── style_login.css
├── stylesheet.css
│
├── images/
│   ├── products/
│   ├── categories/
│   ├── features/
│   └── reviews/
│
└── README.md
```

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive design |
| JavaScript | Website functionality |
| Firebase | User authentication |
| Local Storage | Saving cart/address data |
| Swiper.js | Product and review sliders |
| Font Awesome | Icons |

## ⚙️ Installation & Setup

Follow these steps to run the project on your local machine.

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**2. Navigate to the project folder**

```bash
cd Grocery-Management-App
```

**3. Open the project in VS Code**

```bash
code .
```

**4. Run the website**

Use the VS Code Live Server extension or another local development server.

Do not open `index.html` directly because the project uses JavaScript ES modules.

## 🔥 Firebase Configuration

To enable authentication:

1. Create a project in [Firebase Console](https://console.firebase.google.com/).
2. Navigate to Authentication.
3. Enable Email/Password sign-in.
4. Register your web application.
5. Copy your Firebase configuration.
6. Update the configuration in `firebase.js`.
7. Add your local or deployed domain under Authorized Domains.

## 🚀 Future Improvements

- Product quantity and stock management
- Order history
- Online payment gateway integration
- Admin dashboard
- Product ratings and reviews
- Wishlist functionality
- Order tracking
- Backend database integration

## 👩‍💻 Author

**Developed as a Grocery Management Web Application Project.**

## 📜 License

This project is created for educational and learning purposes.
