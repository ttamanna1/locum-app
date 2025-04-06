# 💊 Pharmacy Locum Agency Platform

I decided to rebuild a locum agency platform using existing platforms available in the UK and combining the best features all into this project. The inspiration came from the closure of Zen Locum, a locum pharmacist shift booking platform; I wanted to add improvements which Zen Locum needed and to combine other features available in other locum platforms. Primarily, the platform allows companies to post shifts for their pharmacies and allows locum pharmacists to book shifts. This project handles authentication, shift booking, cancellations and notifications.

## 🛠️ Tech Stack
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## ✅ Features Implemented So Far
- **Authentication and Authorisation**
    - Secure registration and login for both pharmacists and companies using JWT.
    - Role-based access control for protected routes.
- **User Models and Controllers**
    - Pharmacist model updated to include professional details instead of username.
    - Company model with authentication and profile routes.
    - Dynamic profile and notification endpoints for both users.
- **Job management**
    - Companies can post, update and delete available shifts.
    - Pharmacists can browse, book and cancel shifts.
    - Cancelled shifts notify the respective company via notification.
- **Centralised Error Handling**
    - Reusable error middleware for consistent and clean error responses.
- **Modular Routing**
    - Condensed all route files into one centralised router for clean server setup.
- **Logging**
    - Basic request logger added to aid development/debugging.