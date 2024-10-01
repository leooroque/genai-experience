var express = require('express');
var load = require('consign');
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = function () {
    var application = express();

    application.use(bodyParser.json());
    application.use(bodyParser.urlencoded({extended:true}));
    application.use(cors());
//    application.use(connection(pool));
    
    load ({cwd: '../santander-experience-backend/api'})
    .include('routes')
    .include('controller')
    .include('factory')
    .include('service')
    .into(application);

    return application;
}