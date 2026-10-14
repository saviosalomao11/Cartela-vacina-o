const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("./db/db.json");
const middlewares = jsonServer.defaults({ noCors: true, static: "./public" });

server.use(middlewares);
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Click Vacinas rodando na porta ${port}`);
});