require('dotenv').config();
const express = require('express')
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const connection = require('./config/database');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

configViewEngine(app);

// khai bao route

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', webRoutes);


// test connection
(async () => {

     await connection()
     app.listen(port, hostname, () => {
         console.log(`http://localhost:${port}`)
     })

})();



