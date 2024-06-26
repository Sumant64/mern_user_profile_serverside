const dotenv = require("dotenv");
const express = require("express");
const app = express();
dotenv.config({path: './config.env'});
require('./db/conn');
const cors = require('cors')


app.use(express.json());
app.use(cors());


//we link the router files
app.use(require('./router/auth'));

// app.get('/', (req, res) => {
//     res.send("HELLO WORLD!")
// })

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`)
})