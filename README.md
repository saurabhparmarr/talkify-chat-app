# 💬 Talkify - Real-Time Chat Application

A full-stack real-time chat application built using the **MERN Stack** and **Socket.IO**. The application enables secure authentication, instant messaging, online presence, typing indicators, image sharing, and persistent chat history through a modern and responsive interface.

---

## 🚀 Features

- 🔐 JWT Authentication with HTTP-Only Cookies
- 💬 Real-Time Messaging using Socket.IO
- 🟢 Online / Offline User Status
- ⌨️ Typing Indicator
- 🕒 Message Timestamps
- 📜 Persistent Chat History (MongoDB)
- 🖼️ Image Sharing (Cloudinary)
- 👤 Profile Update
- 📱 Responsive UI
- ⚡ Fast and Modern React Interface

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Zustand
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- JWT Authentication

### Database
- MongoDB (Mongoose)

### Cloud Storage
- Cloudinary

---

# 📁 Project Structure

## Backend

```text
Backend/
├── config/
│   └── db.js
│
├── controllers/
│   ├── message.controller.js
│   └── user.controller.js
│
├── lib/
│   ├── cloudinary.js
│   ├── socket.js
│   └── util.js
│
├── middlewares/
│   └── auth.middleware.js
│
├── models/
│   ├── message.model.js
│   └── user.model.js
│
├── routes/
│   ├── message.routes.js
│   └── user.routes.js
│
├── index.js
├── package.json
└── .env.example
```

## Frontend

```text
Frontend/
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ChatContainer.jsx
│   │   ├── MessageInput.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── NoChatSelected.jsx
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── axios.js
│   │   ├── config.js
│   │   └── utils.js
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Profile.jsx
│   │
│   ├── store/
│   │   ├── useAuthStore.js
│   │   └── useChatStore.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/talkify-chat-app.git

cd talkify-chat-app
```

---

## Backend Setup

```bash
cd Backend

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **Backend** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

---

# 📌 Design Decisions

- Socket.IO is used for real-time communication.
- JWT with HTTP-Only Cookies provides secure authentication.
- Zustand is used for lightweight global state management.
- MongoDB stores user and chat data persistently.
- Cloudinary handles image uploads efficiently.
- Modular folder structure improves scalability and maintainability.

---

# 📌 Assumptions

- Users must be authenticated before accessing chats.
- MongoDB Atlas is configured correctly.
- Cloudinary credentials are valid.
- Internet connection is required for real-time messaging.

---

# 🚀 Deployment

### Frontend

Vercel

### Backend

Render

### Database

MongoDB Atlas

---

# 👨‍💻 Author

**Saurabh Singh**

MERN Stack Developer

GitHub: https://github.com/saurabhparmarr