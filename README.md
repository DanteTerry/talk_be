README.md

<div align="center">
  <img width="100%" height="auto" src="https://private-user-images.githubusercontent.com/112513589/376260774-93355086-0b52-48e6-9f0e-f1af6fda97f7.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mjg5MTMwNzksIm5iZiI6MTcyODkxMjc3OSwicGF0aCI6Ii8xMTI1MTM1ODkvMzc2MjYwNzc0LTkzMzU1MDg2LTBiNTItNDhlNi05ZjBlLWYxYWY2ZmRhOTdmNy5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQxMDE0JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MTAxNFQxMzMyNTlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0yMDE2NDQ1N2U0Yzg1MjFlMjUwYjFjYzAxMTNiOWZjODg0MTcyZDFjMjBhNGIwYWQ4MWJmYWVkN2U1OWE4MTJkJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Q8UQSVOUyCRFXw6dJtfnI_jDxIpE6cXDqzZcxZnRmyw"  />
</div>

<div align="center">
   <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
  <img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=47A248" alt="mongodb" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
<img src="https://img.shields.io/badge/-Express_JS-black?style=for-the-badge&logoColor=white&logo=express&color=000000" alt="express.js" />
<img src="https://img.shields.io/badge/-Socket.IO-black?style=for-the-badge&logoColor=white&logo=socket.io&color=010101" alt="socket.io" />
</div>

###

<h2 align="center">Talk</h2>

###

<p align="center">Talk is an all-in-one communication platform that connects you with friends, family, and colleagues through chat, voice, and video.</p>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. ⚡ [Performance](#performance)
5. 🤸 [Quick Start](#quick-start)
6. 🚀 [More](#more)

## <a name="introduction">🤖 Introduction</a>

Talk is designed for effortless communication, offering a variety of features that keep you connected wherever you are. From one-on-one chats to group conversations, Talk enables users to engage via instant messaging, voice, and video calls.

Whether you’re sharing files, sending images, video or audio, Talk has you covered. The platform's standout feature is real-time chat translation, making global interactions smoother by translating messages instantly. Alongside a range of additional features like online status updates, typing indicators, friend requests, and notifications, Talk ensures a robust and responsive communication experience.

Talk is your go-to app for maintaining personal and professional connections, bridging the gap between languages, and making every conversation engaging and hassle-free.

## <a name="tech-stack">⚙️ Tech Stack</a>

- React for dynamic and interactive user interfaces
- Node.js and Express.js for scalable server-side logic and API management
- Socket.IO for real-time, bidirectional communication for chat and notifications
- Simple-Peer for seamless peer-to-peer video and voice calls
- Tailwind CSS for responsive, mobile-first design and styling
- Cloudinary for file and media management (image and video storage)
- NextAuth for secure authentication and user session management

## <a name="features">🔋 Features</a>

💬 **Instant Messaging**: Stay connected with friends and family through one-on-one or group text chats with real-time updates.

📞 **Voice & Video Calls**: Enjoy high-quality voice and video calls, enabling you to stay in touch across the globe using peer-to-peer technology.

🌍 **Chat Translation**: Break language barriers with real-time message translation, making conversations effortless regardless of the language spoken.

📁 **File Sharing**: Easily send documents, images, and media files to your contacts, stored and optimized with Cloudinary.

🖋️ **Typing Indicator**: Know when your friends are responding with the typing indicator for an interactive experience.

🟢 **Online Status**: Instantly see when your contacts are online or last active, helping you time your communication perfectly.

🤝 **Friend Requests & Management**: Add new friends or send and receive friend requests, manage your connections, and remove friends when necessary.

👥 **Group Chats**: Create and manage group chats to stay connected with multiple people at once, making it ideal for team discussions or socializing.

🔔 **Notifications**: Receive push notifications for new Friend requests ensuring you never miss important communication.

🛡️ **Privacy & Security**: End-to-end encryption ensures all your chats and calls are secure, safeguarding your personal conversations.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/DanteTerry/talk_be.git
cd talk_be
```

**Installation**

Install the project dependencies using npm:

```bash
npm run dev
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
#APPLICATION
PORT=


#MONGODB
MONGO_USERNAME=
MONGO_PASS=
MONGO_URL=

#DEFAULT_DATA
DEFAULT_STATUS=
DEFAULT_USER_PICTURE=
DEFAULT_GROUP_PICTUR

#JWT
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

#FRONTEND_URL
LOCALHOST_URL=

```

Replace the placeholder values with your actual respective account credentials. You can obtain these credentials by signing up on the [Cloudinary](https://cloudinary.com),[MongoDB](https://www.mongodb.com)

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

##

## Connect with Me

Feel free to reach out if you have any questions, feedback, or just want to chat! You can connect with me via:

- Email: [Arpityadav2998@gmail.com](mailto:arpityadav2998@gmail.com)
- LinkedIn: [Arpit Yadav](https://www.linkedin.com/in/arpityadav0/)
- Twitter: [@Arpit685895](https://twitter.com/Arpit685895)

##

<h2>Thank you for visiting</h2>
