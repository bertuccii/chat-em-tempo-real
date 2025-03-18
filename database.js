const Database = require("better-sqlite3");
const db = new Database("chat.db");

// Criar tabela de usuários
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`).run();

// Criar tabela de mensagens
db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        message TEXT,
        timestamp INTEGER
    )
`).run();

module.exports = db;
