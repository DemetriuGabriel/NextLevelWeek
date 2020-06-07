const express = require("express");
const server = express();

//configure public folder
server.use(express.static("public"))

// using template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})

// configure my application paths

// page home
// req: Requisition (requisição)
// res: Response (resposta)
server.get("/", (req, res) => {
  return res.render("index.html", {title: "um título"})
})

server.get("/create-point", (req, res) => {
  return res.render("create-point.html")
})

server.get("/search", (req, res) => {
  return res.render("search-results.html")
})

// turn on the server 
server.listen(3000);