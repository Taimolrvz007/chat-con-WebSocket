# 💬 Chat en Vivo con WebSocket

Chat en tiempo real construido con **Socket.IO**, **React** y **Express**. Permite enviar y recibir mensajes instantáneamente entre múltiples usuarios con selección de persona/nombre.

---

## 🚀 Demo

> Repositorio: [github.com/Taimolrvz007/chat-con-WebSocket](https://github.com/Taimolrvz007/chat-con-WebSocket.git)

---

## 🛠️ Tecnologías

### Frontend
- React 19
- TypeScript
- Vite
- Socket.IO Client

### Backend
- Node.js
- Express 5
- Socket.IO
- CORS

---

## 📁 Estructura del proyecto

```
chat-con-WebSocket/
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── personas.tsx
│   │   └── estetica.css
│   ├── package.json
│   └── vite.config.ts
└── backend/
    ├── index.js
    └── package.json
```

---

## ⚙️ Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/Taimolrvz007/chat-con-WebSocket.git
cd chat-con-WebSocket
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

Dependencias que se instalan:

| Paquete | Versión |
|---|---|
| express | ^5.2.1 |
| socket.io | ^4.8.3 |
| socket.io-client | ^4.8.3 |
| cors | ^2.8.6 |

### 3. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

Dependencias que se instalan:

| Paquete | Versión |
|---|---|
| react | ^19.2.6 |
| react-dom | ^19.2.6 |
| socket.io-client | ^4.8.3 |

### 4. Ejecutar el backend

```bash
cd backend
node index.js
```

El servidor corre en: `http://localhost:3000`

### 5. Ejecutar el frontend

```bash
cd frontend
npm run dev
```

La app corre en: `http://localhost:5173`

---

## 💡 Funcionalidades

- ✅ Mensajes en tiempo real con WebSocket
- ✅ Selección de persona/nombre antes de chatear
- ✅ Soporte para múltiples usuarios simultáneos
- ✅ Interfaz estilo Discord

---

## 👤 Autor

**Josue Kaleth Salazar**
- GitHub: [@taimolrvz007](https://github.com/Taimolrvz007)

---

## 📄 Licencia

MIT