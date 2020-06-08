const express = require("express");
const server = express();

//get database
const db = require("./database/db")

//configure public folder
server.use(express.static("public"))

//enable the use of req.body in our application
server.use(express.urlencoded({ extended: true }))

// using template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})

// configure my application paths

// page home
// req: Requisition (requisição)
server.get("/", (req, res) => {
// res: Response (resposta)
  return res.render("index.html", {title: "um título"})
})

server.get("/create-point", (req, res) => {
  //req.query : Query Strings da nossa url
  //console.log(req.query)
  
  return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
  
  //req.body: o body do nosso formulário
  //console.log(req.body)
  
   //insert database data

   const query = `
    INSERT INTO places (
      image,
      name,
      address,
      address2,
      state,
      city,
      items
    ) VALUES (?,?,?,?,?,?,?);
  `
  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items, 
  ]

  function afterInsertData(err) {
    if(err) {
      return console.log(err)
    }

    console.log("Cadastrado com sucesso")
    console.log(this)
  
    return res.render("create-point.html", { saved: true })
  }

  db.run(query, values, afterInsertData)
})

server.get("/search", (req, res) => {
  
  const search = req.query.search

  if(search == "") {
    // pesquisa vazia
    return res.render("search-results.html", { total: 0 })
  }

  //get data of database
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
    if(err) {
       return console.log(err)
    }
    
    const total = rows.length

    // show html page with data from database
    return res.render("search-results.html", { places: rows, total })
  })
  
})

// turn on the server 
server.listen(3000);