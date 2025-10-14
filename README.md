---

# ⚙️ Technova Platform

Technova is a full-stack web application built with **React + TypeScript + Vite** for the frontend and **JSON-Server / Express** for the backend.  
It provides **role-based access**:
- **Admin:** can manage (CRUD) registered users.
- **User:** can browse products and place orders.

---

## 🚀 Project Overview

This project simulates a small e-commerce dashboard:
- **Admin Dashboard:** Manage users (add, edit, delete, activate/deactivate).
- **User Dashboard:** View available products and make purchase orders.
- **Database:** Managed through `json-server` using `db.json`.

---

## 🧱 Folder Structure

```

technova/
├── db.json                  # Database: users, products, and orders
├── dist/                    # Compiled production files
│   └── server.js
├── eslint.config.js         # ESLint configuration
├── index.html               # Vite entry HTML
├── package.json             # Dependencies and scripts
├── package-lock.json
├── public/                  # Public assets
│   └── vite.svg
├── README.md                # Project documentation
├── server.ts                # Express or backend entry
├── src/
│   ├── api/                 # Axios instance and API helpers
│   ├── assets/              # Images, icons, and static resources
│   ├── components/          # Reusable UI components
│   ├── index.css            # Global styles
│   ├── main.tsx             # Frontend entry point (React + Vite)
│   ├── pages/               # Dashboard and login pages
│   └── routes/              # SPA navigation and route protection
├── tsconfig.app.json        # App TypeScript configuration
├── tsconfig.json            # Root TypeScript config
├── tsconfig.node.json
├── tsconfig.server.json
└── vite.config.ts           # Vite project setup

````

---

## ⚡ Installation and Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/coder-sergio/Technova

cd technova
````

### 2️⃣ Install dependencies

```bash
npm install

or

npm install @tailwindcss/vite axios cors express primeicons primereact react react-dom react-hook-form react-router-dom react-toastify sweetalert2 tailwindcss zustand

```

---

## 🖥️ Running the Application

### ▶️ Start the Frontend (Vite)

Runs the React development server on **[http://localhost:5173](http://localhost:5173)**

```bash
npm run dev
```

---

### 🗄️ Start the Backend (JSON Server)

Launches the backend API at **[http://localhost:3000](http://localhost:3000)**

```bash
npm run backend
```

The backend uses the file [`db.json`](./db.json) as its mock database.

---

## 🔑 Default Credentials

You can log in with the following users:

| Role  | Email            | Password   |
| ----- | ---------------- | ---------- |
| Admin | `admin@tech.com` | `admin123` |
| User  | `user@tech.com`  | `user123`  |

---

## 🧩 Features Summary

### 👨‍💼 **Admin Dashboard**

* View all registered users (except self)
* Add, edit, delete, or deactivate users
* Manage active/inactive status

### 🧑‍💻 **User Dashboard**

* Browse available products (`active: true`)
* Add items to a cart
* Adjust quantities and remove items
* Place an order stored in `db.json` under `"pedidos"`

---

## 🧠 Tech Stack

| Category    | Technology                 |
| ----------- | -------------------------- |
| Frontend    | React 19, TypeScript, Vite |
| UI Library  | PrimeReact, TailwindCSS    |
| Backend     | JSON Server, Express       |
| HTTP Client | Axios                      |
| Alerts      | SweetAlert2                |
| Forms       | React Hook Form            |
| State       | Zustand                    |

---

## 🛠️ Scripts Summary

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Runs the frontend (Vite)      |
| `npm run backend` | Runs JSON Server on port 3000 |
| `npm run build`   | Builds the app for production |
| `npm run lint`    | Lints and fixes code issues   |

---

## 📂 API Endpoints

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| GET    | `/usuarios`     | Get all users      |
| POST   | `/usuarios`     | Add new user       |
| PUT    | `/usuarios/:id` | Update user        |
| DELETE | `/usuarios/:id` | Delete user        |
| GET    | `/productos`    | List products      |
| POST   | `/pedidos`      | Create a new order |

---

## 🧾 Example Order JSON (in `db.json`)

```json
{
  "id": "1",
  "usuarioId": 2,
  "productos": [
    { "productoId": 1, "cantidad": 1 }
  ],
  "fecha": "2025-10-14",
  "estado": "pendiente"
}
```

---

## 🧑‍💻 Author

**Sergio Andrés Bonilla**
Developer


---

## 🧠 License

This project is licensed under the **coder-sergio** — free to use, modify, and distribute.


