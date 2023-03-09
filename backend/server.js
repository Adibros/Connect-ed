const app = require("./app");

require("dotenv").config({path:"backend/config/config.env"})
app.listen(process.env.PORT,() =>{
    console.log(`Working on PORT ${process.env.PORT}`);
})