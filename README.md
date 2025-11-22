# IITKReSale - Campus Marketplace
<img width="256" height="256" alt="IITKReSale" src="https://github.com/user-attachments/assets/352b8d0f-f2a3-4306-b706-44840c4c5e95" />

IITKReSale is a full-stack e-commerce platform built exclusively for the IIT Kanpur community. It provides a secure, trusted, and centralized marketplace for students and faculty to buy and sell new or used items like cycles, books, lab equipment, and more.

## 📖 Table of Contents

* [About The Project](#about-the-project)
* [🚀 Key Features](#-key-features)
* [🛠️ Tech Stack](#️-tech-stack)
* [🔄 Application Flow](#-application-flow)
* [📸 Key Pages & Screenshots](#-key-pages--screenshots)
  * [1. Homepage](#1-homepage)
  * [2. Registration & OTP Verification](#2-registration--otp-verification)
  * [3. Login Page](#3-login-page)
  * [4. Marketplace](#4-marketplace)
  * [5. Product Details](#5-product-details)
  * [6. User Dashboard](#6-user-dashboard)
  * [7. Real-Time Chat](#7-real-time-chat)
  * [8. Add New Item](#8-add-new-item)
* [🏁 Getting Started](#-getting-started)
  * [Prerequisites](#prerequisites)
  * [Backend Setup](#backend-setup)
  * [Frontend Setup](#frontend-setup)
* [☁️ Deployment](#️-deployment)
* [👤 Author](#-author)

## About The Project

Students and faculty at IIT Kanpur often need to **buy or sell** used **items—cycles, mattresses, lab coats, electronics, and books.** This process is often scattered across various informal social media groups, which can be inefficient and lack security.

IITKReSale solves this by providing a dedicated, secure, and **exclusive platform** for the **campus community.** The core of this security is the mandatory **email verification**, which ensures that only users with a valid **`@iitk.ac.in`** email address can register, creating a trusted environment for all transactions.


## 🚀 Key Features

> **IITK-Exclusive:** Secure registration flow that only allows users with a valid `@iitk.ac.in` email address.
>
> **Email OTP Verification:** Robust user verification using a 6-digit OTP sent via Nodemailer for both registration and "Login with OTP" functionality.
>
> **Real-Time Chat:** A built-in messaging system using **Socket.IO** allows buyers and sellers to communicate, negotiate, and arrange meetups instantly.
>
> **Dynamic Marketplace:** A clean, responsive interface built with **React** and **Tailwind CSS** to browse, search, and filter items by category or condition.
>
> **Personal User Dashboard:** A dedicated dashboard for users to manage their items for sale and view all their active chat conversations in one place.
>
> **Full-Stack Platform:** A complete MERN stack application with a Node.js/Express.js backend API and a modern React.js frontend.
>
> **Image Uploads:** Users can upload multiple images for their product listings.


## 🛠️ Tech Stack

* **Frontend:** React.js, React Router, Tailwind CSS, Axios, Socket.IO Client
* **Backend:** Node.js, Express.js, Socket.IO
* **Database:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcrypt
* **Email & File Handling:** Nodemailer (for OTPs), Multer (for image uploads)

## 🔄 Application Flow

The user journey is designed to be secure and intuitive, revolving around the chat system.

1.  **Registration:** A new user visits the site and signs up using their name, details, and a **mandatory `@iitk.ac.in` email**.
2.  **Email Verification:** The backend sends a 6-digit OTP to their IITK email. The user must enter this code on the "Verify OTP" page to activate their account.
3.  **Login:** The user can now log in using either their username and password OR by requesting a one-time login OTP to their email.
4.  **Browsing:** The user can browse the marketplace, search for items, and click on any item to see its details.
5.  **Initiating Contact:** On a product detail page, the user types a message and clicks "Send Message & Start Chat". This action creates a new, private chat room between the buyer and the seller.
6.  **Chat & Negotiation:** The seller instantly sees the new conversation in their User Dashboard. Both users can then communicate in real-time within the Chat Page to discuss the item and arrange a sale.
7.  **Posting Items:** Any logged-in user can navigate to the "Add Item" page from their dashboard to post their own items for sale.

## 📸 Key Pages & Screenshots

### 1. Homepage

The main landing page that explains the platform's value proposition, key features, and how the "List, Chat, Sell" process works.

<img width="1898" height="931" alt="image" src="https://github.com/user-attachments/assets/891f55b4-d942-4260-98ce-08f53368c042" />


### 2. Registration & OTP Verification

A secure, multi-step registration process. The form validates that the email address ends in `@iitk.ac.in`. Upon submission, the user is redirected to the OTP page to enter the code sent to their email, verifying their identity.

![[image: A screenshot of the Registration Page]](./docs/images/register-page.png)
![[image: A screenshot of the OTP Verification Page]](./docs/images/otp-page.png)

### 3. Login Page

Provides two flexible methods for user sign-in: a traditional password login or a passwordless "Login with Email OTP" option for convenience.

![[image: A screenshot of the Login Page with password and OTP options]](./docs/images/login-page.png)

### 4. Marketplace

The main store page where users can browse all available listings. It features a category sidebar and a search bar for easy filtering of items.

![[image: A screenshot of the All Items Marketplace Page]](./docs/images/marketplace-page.png)

### 5. Product Details

A detailed view of a single item, showing its description, price, condition, seller information, and an interactive image gallery. This is also where a buyer can initiate a chat with the seller.

![[image: A screenshot of a single Product's Detail Page]](./docs/images/product-details.png)

### 6. User Dashboard

The user's personal hub. It features two main sections:

* **My Items for Sale:** A grid of all items the user has listed.
* **My Chats:** A list of all active conversations with buyers or sellers, which navigates to the chat page.

![[image: A screenshot of the User Dashboard]](./docs/images/dashboard-page.png)

### 7. Real-Time Chat

A private, real-time chat interface (powered by Socket.IO) between a buyer and a seller. It features:

* User avatars with initials.
* Styled message bubbles (blue for sender, gray for receiver).
* Real-time "is typing..." indicators.
* Timestamps for each message.

![[image: A screenshot of the live Chat Page]](./docs/images/chat-page.png)

### 8. Add New Item

An easy-to-use, themed form for users to post their own items for sale. It includes fields for item name, description, category, price, condition, and multiple image uploads.

![[image: A screenshot of the Add New Item form]](./docs/images/add-item.png)

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm
* A MongoDB Atlas connection string (or a local MongoDB instance)

### Backend Setup

1.  Clone the repository:
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```
2.  Navigate to the backend directory:
    ```sh
    cd your-repo-name/Backend
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```
4.  Create a `.env` file in the `Backend` directory and add the following essential variables:
    ```env
    PORT=8000
    MONGODB_URI="your_mongodb_connection_string"
    CORS_ORIGIN="http://localhost:5173"
    JWT_SECRET="your_super_secret_jwt_key"
    
    # For Nodemailer (Gmail)
    EMAIL_USER="your-email@gmail.com"
    EMAIL_PASS="your-16-digit-gmail-app-password"
    ```
5.  Run the server:
    ```sh
    npm run dev
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```sh
    cd ../Frontend
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Create a `.env.development` file in the `Frontend` directory:
    ```env
    VITE_API_BASE_URL="http://localhost:8000/api/v1"
    VITE_SOCKET_URL="http://localhost:8000"
    ```
4.  Run the client:
    ```sh
    npm run dev
    ```
    Your application should now be running locally at `http://localhost:5173`.

## ☁️ Deployment

This project is configured for a split deployment:

* **Frontend (Vercel):** The React application is hosted on Vercel, which automatically builds and deploys the app from the `Frontend` directory. Environment variables (like `VITE_API_BASE_URL` and `VITE_SOCKET_URL`) are set in the Vercel project settings.
* **Backend (Krutrim/VM):** The Node.js server is deployed on a Krutrim cloud VM. It is run as a persistent service using **PM2** to ensure it's always online.

## 👤 Author

**Krrish Khandelwal**

* **LinkedIn:** [linkedin.com/in/krrish-khandelwal-9abb271bb/](https://www.linkedin.com/in/krrish-khandelwal-9abb271bb/)
* **GitHub:** [github.com/krrishkh](https://github.com/krrishkh)
