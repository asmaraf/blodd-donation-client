# 🩸 BloodLife - Blood Donation Management System

[![Live Site](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://blodd-donation-client.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

BloodLife is a modern blood donation management platform designed to connect voluntary blood donors with individuals and hospitals in need of blood across Bangladesh.

---

## 📌 Project Overview

**BloodLife Client** is the frontend application of the BloodLife blood donation management system.

The platform provides an intuitive and responsive experience for donors, volunteers, and administrators. Users can search for blood donors by location and blood group, create and manage donation requests, track request statuses, and contribute funds through Stripe.

The application is built with **React 18, Vite, Tailwind CSS, React Router, and modern frontend libraries**.

---

## 📸 Application Screenshot

![BloodLife Application](assets/Screenshot.png)

## ✨ Key Features

### 🩸 Blood Donor Search

- Search donors by blood group.
- Filter donors by district and upazila.
- Location-based donor discovery.
- Bangladesh geolocation data integration.
- Export donor search results as PDF.

### 📋 Donation Requests

- Browse active blood donation requests.
- Create new donation requests.
- Track donation request status.
- Update request progress.
- Cancel completed or unnecessary requests.

### 🔐 Authentication & Authorization

- Secure user authentication.
- JWT-based session management.
- Protected routes.
- Role-based access control.
- Donor, Volunteer, and Admin roles.
- Persistent login sessions.

### 👤 User Profile

- View personal profile information.
- Update profile details.
- Protected email information.
- User session persistence across page reloads.

### 👨‍💼 Role-Based Dashboards

**Donor**
- Create donation requests.
- Track donation progress.
- Manage personal profile.

**Volunteer**
- Review donation requests.
- Filter requests by status.
- Update request progression.

**Admin**
- Manage users.
- Activate or block users.
- Promote user roles.
- Manage donation requests.
- View funding statistics.

### 💳 Stripe Funding

- Stripe payment integration.
- Secure contribution flow.
- Funding and contribution management.

### 📊 Analytics

- Dynamic statistics.
- Donation and funding insights.
- Interactive charts using Recharts.

### 🎨 Modern UI/UX

- Fully responsive design.
- Dark and light mode.
- Glassmorphism UI.
- Smooth animations.
- Interactive 3D elements.
- Custom loading animations.
- Custom 404 page.

---

## 🛠️ Tech Stack

### Frontend

- React 18
- Vite 5
- Tailwind CSS
- PostCSS
- Autoprefixer

### Routing & State

- React Router DOM
- Context API

### HTTP & Authentication

- Axios
- JWT-based authentication

### UI, Animation & Icons

- Lucide React
- Framer Motion
- GSAP
- Spline 3D

### Payment

- Stripe Elements
- @stripe/react-stripe-js
- @stripe/stripe-js

### Data Visualization & Reporting

- Recharts
- jsPDF
- html2canvas

### Notifications

- React Hot Toast

---

## 📦 Dependencies

```json
{
  "@splinetool/react-spline": "^4.1.0",
  "@splinetool/runtime": "^2.0.5",
  "@stripe/react-stripe-js": "^2.7.0",
  "@stripe/stripe-js": "^3.3.0",
  "axios": "^1.6.8",
  "framer-motion": "^11.1.7",
  "gsap": "^3.15.0",
  "html2canvas": "^1.4.1",
  "jspdf": "^2.5.1",
  "lucide-react": "^0.372.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-hot-toast": "^2.4.1",
  "react-router-dom": "^6.23.0",
  "recharts": "^2.12.6"
}
```

---

## 🚀 Getting Started

Follow these steps to run the BloodLife client application locally.

### 1. Clone the Repository

```bash
git clone https://github.com/asm-araf/blodd-donation-client.git
```

### 2. Navigate to the Project

```bash
cd blodd-donation-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key_here
```

> Never commit your private API keys or secret credentials to GitHub.

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 🏗️ Build for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The production files will be generated in the `dist` directory.

---

## 📂 Project Structure

```text
blodd-donation-client
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🌐 Live Demo & Relevant Links

### Frontend

🔗 **Live Application:**  
https://blodd-donation-client.vercel.app/

### Backend

🔗 **Live API:**  
https://blodd-donation-server.onrender.com

### Server Repository

🔗 **GitHub Repository:**  
https://github.com/asm-araf/blodd-donation-server

---

## 👤 Demo Admin Credentials

For demonstration purposes:

```text
Email: admin@bloodlife.com
Password: Admin123!
```

> These credentials should only be used for the deployed demo environment.

---

## 👨‍💻 Author

**Abu Saleh MD Araf**

GitHub:  
https://github.com/asm-araf

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
