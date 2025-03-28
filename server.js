// importando os módulos necessários
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const db = require("./database");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

// 📌 Configurações do Servidor

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
// 📌 Configurações do Express
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// 📌 Variáveis Globais
const SECRET_KEY = process.env.SECRET_KEY
const users = {};
const userColors = {}; // Armazena a cor de cada usuário

// 📌 Função para gerar uma cor única para cada usuário
function getColorForUser(username) {
    if (!userColors[username]) {
        const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const color = `hsl(${hash % 360}, 70%, 50%)`;
        userColors[username] = color;
    }
    return userColors[username];
}

// 📌 Função para buscar mensagens das últimas 2 horas
function getRecentMessages() {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    return db.prepare("SELECT * FROM messages WHERE timestamp >= ? ORDER BY timestamp ASC").all(twoHoursAgo);
}

// 📌 Redirecionar para login se a página não existir
app.get("*", (req, res) => {
    res.redirect("/login.html");
});
// 📌 Rota para cadastro
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Usuário e senha são obrigatórios!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashedPassword);
        res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (error) {
        res.status(400).json({ error: "Nome de usuário já existe!" });
    }
});

// 📌 Rota para login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Usuário ou senha inválidos!" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "2h" });
    res.json({ token });
});

// 📌 WebSockets para o Chat
io.on("connection", (socket) => {
    console.log("🟢 Novo usuário conectado:", socket.id);

    socket.on("set username", (username) => {
        users[socket.id] = username;
        const color = getColorForUser(username);
        io.emit("update users", Object.entries(users).map(([id, name]) => ({ name, color })));
        socket.emit("set color", color);

        // Enviar mensagens antigas ao usuário que entrou
        const recentMessages = getRecentMessages();
        socket.emit("previous messages", recentMessages);
    });

    // 📌 Enviar mensagens públicas e privadas
    socket.on("chat message", ({ username, message, recipient }) => {
        const timestamp = Date.now();
        const color = getColorForUser(username);

        if (recipient) {
            const recipientSocket = Object.keys(users).find(key => users[key] === recipient);
            if (recipientSocket) {
                io.to(recipientSocket).emit("private message", { username, message, color });
                io.to(socket.id).emit("private message", { username, message, color });
            }
        } else {
            // Armazenar mensagem no banco de dados SQLite
            db.prepare("INSERT INTO messages (username, message, timestamp) VALUES (?, ?, ?)").run(username, message, timestamp);
            io.emit("chat message", { username, message, timestamp, color });
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 Usuário desconectado:", socket.id);
        delete users[socket.id];
        io.emit("update users", Object.entries(users).map(([id, name]) => ({ name, color: getColorForUser(name) })));
    });
});

// 📌 Iniciar o Servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Chat rodando em http://localhost:${PORT}`);
});
