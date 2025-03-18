# 📢 Chat em Tempo Real

## 📌 Descrição  
Este é um **chat em tempo real** desenvolvido com **Node.js**, **Express** e **Socket.io**, utilizando **SQLite** para armazenamento de mensagens e usuários. O sistema permite **cadastro e login**, envio de mensagens **públicas e privadas**, e armazena as mensagens das últimas duas horas.

## 🚀 Tecnologias Utilizadas  
- **Node.js**  
- **Express**  
- **Socket.io**  
- **Better-SQLite3**  
- **Bcrypt.js** (para criptografia de senhas)  
- **JSON Web Token (JWT)** (para autenticação)  
- **Dotenv** (para variáveis de ambiente)  
- **CORS**  

## 📂 Estrutura do Projeto  
```
/projeto-chat
│── public/                # Arquivos estáticos do frontend
│   │── chat.html          # Interface do chat
│   │── login.html         # Página de login
│   │── register.html      # Página de cadastro
│── database.js            # Configuração do banco de dados SQLite
│── server.js              # Servidor Express e WebSocket
│── package.json           # Dependências e scripts
│── .env                   # Variáveis de ambiente (chave secreta JWT)
```

## 🔧 Configuração e Execução  

1. **Instale as dependências**  
   ```sh
   npm install
   ```

2. **Configure as variáveis de ambiente**  
   No arquivo `.env`, defina sua chave secreta:  
   ```
   SECRET_KEY="sua_chave_secreta_aqui"
   ```

3. **Inicie o servidor**  
   ```sh
   npm start
   ```
   O servidor estará rodando em **http://localhost:3000**.

## 🛠️ Funcionalidades  

✅ **Cadastro e login de usuários**  
✅ **Criptografia de senhas** com bcrypt  
✅ **Mensagens em tempo real** via WebSocket  
✅ **Suporte a mensagens privadas**  
✅ **Armazenamento de mensagens das últimas 2 horas**  
✅ **Autenticação com JWT**  

## 👤 Autor  
- **Felipe Bertucci** ([@bertuccii](https://github.com/bertuccii))
