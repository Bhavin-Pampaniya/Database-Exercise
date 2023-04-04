require("dotenv").config();
const express = require("express")
const app = express();
const helmet = require("helmet");
const cityRoute = require("./routes/cityRoute");
const cinemaRoute = require("./routes/cinemaRoute");
const reportRoute = require("./routes/reportsRoute");
const ceoRoute = require("./routes/ceoRoute");


app.use(helmet())
app.use(express.urlencoded({extended:false})) 
app.use(express.json())
app.use("/api/city",cityRoute);
app.use("/api/cinema/",cinemaRoute);
app.use("/api/report/",reportRoute);
app.use("/api/ceo/",ceoRoute);

app.get("/",(req,res)=>{
    console.log(req.session);
    res.json({res:"main"});


})


app.listen(3000);


