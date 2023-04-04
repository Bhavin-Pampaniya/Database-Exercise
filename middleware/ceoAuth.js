const express = require("express")
const session = require("express-session");
const app = express();
const redis = require("redis")

const redisClient = redis.createClient();

(async () => {
    await redisClient.connect();
})();
  
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});

app.use(session({secret: 'Your_Secret_Key', resave: true, saveUninitialized: true}))

const validateLogin = async (req,res,next)=>{
    const username = await redisClient.get("username");
    if(!username){
        res.json({mess:"please login first to access this route"});
    }

    // res.json("hello "+username); 
    next(); 
}


module.exports = {validateLogin};