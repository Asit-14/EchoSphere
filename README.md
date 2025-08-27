# 🟣 EchoSphere

![Owner Avatar](https://avatars.githubusercontent.com/u/140405662?v=4)

Welcome to **EchoSphere** – a next-generation, real-time chat platform designed for seamless connection, collaboration, and communication.  
Crafted with passion by [Asit-14](https://github.com/Asit-14), EchoSphere brings people together with speed, security, and style.

---

## 🚀 Live Project Showcase

- **Group Chats:** Connect with multiple users in dynamic, organized groups.
- **Direct Messaging:** Enjoy instant, secure communication.
- **Real-Time Updates:** Powered by WebSocket for lightning-fast message delivery.
- **Responsive UI:** Beautifully designed for both desktop and mobile.
- **Secure Authentication:** Robust login and registration for privacy and protection.
- **Message History:** Never lose important conversations.

---

## 🗂️ Repository Structure

```
EchoSphere/
├── 📁 public              # Frontend files
├── 📁 server              # Backend logic
├── 📄 .env                # Environment configuration
├── 📄 .gitignore
├── 📄 docker-compose.yml  # Docker setup
├── 📄 package.json        # Project metadata
├── 📄 package-lock.json
├── 📄 Project report.docx # Project documentation
├── 📄 Project report.pdf  # Project documentation PDF
├── 📄 presentation.pptx   # Project presentation
├── 📄 README.md           # This file!
└── 📄 text.txt            # Miscellaneous
```

---

## ✨ Screenshots & Demo

> _Add demo screenshots or GIFs here to showcase the chat UI and features!_

---

## 🏅 Certificate

Proudly completed and certified for real-time chat development!  
👉 [Level 3 Certificate.pdf](./Level%203%20Certificate.pdf)

---

## 📝 Project Documentation

- [Project report.docx](./Project%20report.docx)
- [Project report.pdf](./Project%20report.pdf)
- [presentation.pptx](./presentation.pptx)

---

## ⚡ Installation Guide

**Requirements:**
- [Node.js](https://nodejs.org/) (Recommend latest LTS)
- [MongoDB](https://www.mongodb.com/)
- Docker (optional, for containerized deployment)

**Setup Steps:**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Asit-14/EchoSphere.git
   cd EchoSphere
   ```

2. **Install dependencies:**
   ```bash
   cd server && npm install
   cd ../public && npm install
   ```

3. **Configure your environment:**
   - Add your environment variables to `.env` file in `server` and `public` folders.

4. **Run MongoDB** (locally or via Docker).

5. **Start the frontend and backend:**
   ```bash
   # In one terminal
   cd server
   npm start

   # In another terminal
   cd public
   npm start
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

**_For Docker deployment:_**
   
1. **Update MongoDB Connection:**
   - Make sure the MongoDB Atlas URL is correctly set in both the server/.env file and docker-compose.yml
   - The MongoDB URL is: `mongodb+srv://asitshakya789:Fsi%401234@echosphere-db.2mzknvv.mongodb.net/?retryWrites=true&w=majority&appName=echosphere-db`

2. **Update API URL for Production:**
   - When deploying to a server, update the REACT_APP_API_URL in docker-compose.yml to the actual server address
   - For example: `REACT_APP_API_URL=https://your-server-domain.com`

3. **Build and run with Docker:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: `http://your-server-ip:3000`
   - Backend API: `http://your-server-ip:5000`

---

## � Deployment

For detailed deployment instructions, please refer to our [Deployment Guide](DEPLOYMENT_GUIDE.md).

Quick start:
```bash
# With Docker
docker-compose up -d

# Without Docker
# Frontend
cd public
npm install
npm run build

# Backend
cd ../server
npm install
npm start
```

---

## �🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

We welcome your ideas, code, and bug reports!
- Fork the repo
- Create your feature branch (`git checkout -b feature/AmazingFeature`)
- Commit your changes
- Open a pull request

---

## 📬 Contact

Have questions or want to collaborate?  
Open an [Issue](https://github.com/Asit-14/EchoSphere/issues) or connect with [Asit-14](https://github.com/Asit-14).

---

**Let’s make conversations smarter, faster, and more fun! Join EchoSphere and amplify your voice. 🟣💬**
