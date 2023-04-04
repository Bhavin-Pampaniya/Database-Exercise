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
router.get("/getcities",(req,res)=>{
    let getAllCities =  `select * from city`;
    connection.query(getAllCities, (error, results, fields) => {
        if (error) {
          return res.json({error:error.message});
        }
        res.json(results);
      });
})

//TO ADD CITY
router.post("/addcity",(req,res)=>{
  let addCity = `insert into city(name,state) values('${req.body.name}','${req.body.state}')`;
  console.log(req.body);
  connection.query(addCity, (error, results, fields) => {
    if (error) {
      return res.json({error:error.message});

    }
    res.json({status:"Added"});

  });
})

//TO UPDATE A PARTICULAR CITY
router.put("/updatecity/:city",(req,res)=>{
  let sql = `update city
  set name = '${req.body.name}', state = '${req.body.state}'
  WHERE name = '${req.params.city}'`;
  console.log(req.params.city);
  console.log(req.body);
  connection.query(sql, (error, results, fields) => {
    if (error){
      return res.json({error:error.message});

    }
    res.json({status:"updated"});
  });
})

//TO DELETE A PARTICULAR CITY
router.delete("/deletecity/:city",(req,res)=>{
  console.log(req.params.city);

  let sql = `delete from city
  WHERE name = '${req.params.city}' `; 
  connection.query(sql, (error, results, fields) => {
    if (error){
      return res.json({error:error.message});
    }
    res.json({status:"Deleted"});
  });
})

module.exports = router;