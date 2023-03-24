const app = require("./app");
const { connectDatabase } = require("./config/database");

connectDatabase();


app.use('/',(req,res) => {
    res.send("API is running");
})


app.listen(process.env.PORT,() =>{
    console.log(`Working on PORT ${process.env.PORT}`);
})