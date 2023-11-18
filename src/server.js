require('dotenv').config();
const express = require('express')
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const fileUpload = require('express-fileupload');


const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// default options
app.use(fileUpload());

configViewEngine(app);

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// khai bao route
app.use('/', webRoutes);
app.use('/v1/api/', apiRoutes);


// test connection
(async () => {

     await connection()
     app.listen(port, hostname, () => {
         console.log(`http://localhost:${port}`)
     })

})();



