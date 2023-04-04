const express = require("express");
const router = express.Router();
const mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.password,
  database: "tickets",
});

router.get("/bycity/:city", (req, res) => {
  console.log("here");
  let getAllCities = `select distinct m.name from movie m 
                            inner join tickets.show s 
                            on s.movie_id = m.id 
                            inner join cinema_hall c 
                            on c.id = s.cinema_hall_id 
                            inner join cinema
                            on cinema.id = c.cinema_id 
                            inner join city  
                            on cinema.city_id = city.id
                            where city.name = '${req.params.city}';`;

  connection.query(getAllCities, (error, results, fields) => {
    if (error) {
      return res.json({ error: error.message });
    }
    res.json(results);
  });
});

router.get("/bycinemahall/:name", (req, res) => {
  console.log("here");
  let getAllCities = `select distinct m.name from movie m 
                            inner join tickets.show s 
                            on s.movie_id = m.id 
                            inner join cinema_hall c 
                            on c.id = s.cinema_hall_id 
                            where c.name = '${req.params.name}';`;

  connection.query(getAllCities, (error, results, fields) => {
    if (error) {
      return res.json({ error: error.message });
    }
    res.json(results);
  });
});

router.get("/seatingplan", (req, res) => {
  let getAllCities = `select city.name,ssp.seat_id,ssp.show_section_id,ssp.status from show_seating_plan ssp
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
                            inner join city
                            on c.city_id = city.id 
                            where city.name = '${req.query.city}' and m.name = '${req.query.movie}' and  c.id = '${req.query.cinema}' and ch.name = '${req.query.cinema_hall}' and s.id = '${req.query.show}'
                            ;`;
  connection.query(getAllCities, (error, results, fields) => {
    if (error) {
      return res.json({ error: error.message });
    }
    res.json(results);
  });
});

router.get("/toptenactors", (req, res) => {
  let getAllCities = `select count(actor_id) as 'no of movies' ,a.name from movie_cast mc 
                        inner join actor a 
                        on mc.actor_id = a.id 
                        group by actor_id 
                        order by count(actor_id) desc 
                        limit 10
                        ;`;
  connection.query(getAllCities, (error, results, fields) => {
    if (error) {
      return res.json({ error: error.message });
    }
    res.json(results);
  });
});

router.get("/movieyear/:year", (req, res) => {
  let getAllCities = `select name,release_date from movie where release_date like '${req.params.year}%'
  ;`;
  connection.query(getAllCities, (error, results, fields) => {
    if (error) {
      return res.json({ error: error.message });
    }
    res.json(results);
  });
});

module.exports = router;
