const jsonServer = require("json-server");

const server = jsonServer.create();
// Certifique-se de que o seu arquivo db.json está dentro de uma pasta chamada "db"
const router = jsonServer.router("./db/db.json");
// Certifique-se de que o seu app.js, index.html e css estão dentro da pasta "public"
const middlewares = jsonServer.defaults({ noCors: true, static: "./public" });

server.use(middlewares);
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Click Vacinas rodando na porta ${port}`);
});