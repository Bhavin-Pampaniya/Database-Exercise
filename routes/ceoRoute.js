const express = require("express");
const router = express.Router();
const validator = require("express-joi-validation").createValidator();
const session = require("express-session");
const redis = require("redis");
const { validateLogin } = require("../middleware/ceoAuth");
const Joi = require("joi");

const redisClient = redis.createClient();

(async () => {
    await redisClient.connect();
})();
  
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

router.use(session({
    secret: 'secret$%^134',
    resave: true,
    saveUninitialized: true,
}))

 
const mysql = require("mysql"); 
let connection = mysql.createConnection({
  host: "localhost", 
  user: "root",
  password: process.env.password,
  database: "tickets",
});

const querySchema = Joi.object({
  username: Joi.string().required(), 
  password: Joi.string().required(),
});



router.post("/login",validator.body(querySchema),(req,res)=>{
    let getAdmin = `select * from CEO;`; 
    connection.query(getAdmin, async (err, results, fields) => {
        if (err) {
          return res.json({ error: err.message });
        }

        const username = results[0].username;
        const pass = results[0].password;

        // const username = await redisClient.get('username');
        // const pass = await redisClient.get('password');
        if(username === req.body.username && pass === req.body.password){
            // console.log("logged in");
            await redisClient.set('username', `${req.body.username}`);
            await redisClient.set('password', `${req.body.password}`);
            res.json({status:"Logged in successfully"})
        }else{
            res.json({status:"wrong credentials"})
        }
        // console.log(fields);
        // res.json(req.body)
    })
})

router.post("/signup", validator.body(querySchema), (req, res) => {
  let createAdmin = `create table if not exists CEO(
        username varchar(255)not null unique,
        password varchar(255)not null
    )`; 
  connection.query(createAdmin);
  let sql = `INSERT INTO CEO(username,password)
                VALUES('${req.body.username}','${req.body.password}')`;
    connection.query(sql, async (err, results, fields) => {
      if (err) {
        return res.json({ error: err.message });
      }
      req.session.username = req.body.username;
      req.session.password = req.body.password;

      await redisClient.set('username', `${req.body.username}`);
      await redisClient.set('password', `${req.body.password}`);
    
      const username = await redisClient.get('username');
      console.log(username);
      res.json(req.session);
    });  
});

router.get("/getCustomers", validateLogin, (req, res) => {
    // res.json("here")
    let getTopCustomer = `select c.name from customer c 
    inner join booking b 
    on c.id = b.customer_id 
    group by c.name
    order by count(b.id) desc 
    limit 10
    ;`;
    connection.query(getTopCustomer, (error, results, fields) => {
        if (error) {
        //   return res.json({ error: error.message });
        }
        res.json(results);
    });
});


router.get("/getBooking", (req, res) => {
    let getAllCities = `select c.name, count(b.id) as "No of Bookings" from cinema c 
                        inner join cinema_hall ch
                        on c.id = ch.cinema_id
                        inner join tickets.show s
                        on ch.id = s.cinema_hall_id            
                        inner join show_section ss
                        on s.id = ss.show_id
                        inner join show_seating_plan ssp
                        on ss.id = ssp.show_section_id
                        inner join booking b
                        on ssp.booking_id = b.id
                        group by c.id
    ;`;
    connection.query(getAllCities, (error, results, fields) => {
      if (error) {
        return res.json({ error: error.message });
      }
      res.json(results);
    });
  });

  router.get("/getunique", validateLogin, (req, res) => {
    // res.json("here")
    let getTopCustomer = `select distinct c.name from customer c 
    inner join booking b 
    on c.id = b.customer_id
    ;`;
    connection.query(getTopCustomer, (error, results, fields) => {
        if (error) {
        //   return res.json({ error: error.message });
        }
        res.json(results);
    });
});

  router.get("/selectedCustomer", validateLogin, (req, res) => {
    console.log(req.query);
    // res.json("here")
    let getTopCustomer = `select cus.name,m.id,c.id as "cinema id" from customer cus
    inner join booking b 
    on cus.id = b.customer_id
    inner join show_seating_plan ssp
    on b.id = ssp.booking_id
    inner join show_section ss
    on ssp.show_section_id = ss.id
    inner join tickets.show s
    on ss.show_id = s.id
    inner join movie m
    on s.movie_id = m.id
    inner join cinema_hall ch
    on s.cinema_hall_id = ch.id
    inner join cinema c
    on ch.cinema_id = c.id
    where m.id = ${req.query.movie} AND c.id = ${req.query.cinema}

    ;`;
    connection.query(getTopCustomer, (error, results, fields) => {
        if (error) {
          return res.json({ error: error.message });
        }
        res.json(results);
    });
});

 

module.exports = router;
