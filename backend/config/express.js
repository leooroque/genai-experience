var express = require('express');
var load = require('consign');
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = function () {
    var application = express();

    application.use(bodyParser.json());
    application.use(bodyParser.urlencoded({extended:true}));
    application.use(cors());
    
  //load ({cwd: '../genai-experience/backend/api'}) // for debug
    load ({cwd: '../backend/api'}) // for production
    .include('routes')
    .include('controller')
    .include('factory')
    .include('service')
    .into(application);

    return application;
}