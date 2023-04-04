const express = require("express")
const router = express.Router();
const mysql = require("mysql");

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.password,
    database: 'tickets'
});
 
// TO GET ALL CITIES
router.get("/getcinemas",(req,res)=>{
    let getAllCities =  `select * from cinema`;
    connection.query(getAllCities, (error, results, fields) => {
        if (error) {
          return res.json({error:error.message});
        }
        res.json(results);
      });
})

//TO ADD CINEMA
router.post("/addcinema",(req,res)=>{
  let addCity = `insert into cinema(code,name,city_id,address) values('${req.body.code}','${req.body.name}' ,'${req.body.city_id}','${req.body.address}' )`;
  console.log(req.body);
  connection.query(addCity, (error, results, fields) => {
    if (error) {
      return res.json({error:error.message});

    }
    res.json({status:"Added"});

  });
})

//TO UPDATE A PARTICULAR CINEMA
router.put("/updatecinema/:id",(req,res)=>{
  let sql = `update cinema
  set code = '${req.body.code}', name = '${req.body.name}', city_id = '${req.body.city_id}', address = '${req.body.address}'
  WHERE id = '${req.params.id}'`;
  // let data = [req.params.id];
  console.log(req.body);
  connection.query(sql, (error, results, fields) => {
    if (error){
      return res.json({error:error.message});

    }
    res.json({status:"updated"});
  });
})

//TO DELETE A PARTICULAR CIMENA
router.delete("/deletecinema/:id",(req,res)=>{
  console.log(req.params.city);

  let sql = `delete from cinema
  WHERE id = '${req.params.id}' `; 
  // let data = [req.params.id];
  connection.query(sql, (error, results, fields) => {
    if (error){
      return res.json({error:error.message});
    }
    res.json({status:"Deleted"});
  });
})

module.exports = router;