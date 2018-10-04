var express = require("express");
var request = require("request");
var config = require("config");


var contactsRouter = express.Router();

var restEndpoint = config.get("App.webServer.protocol") + '://' + 
                    config.get("App.webServer.host") +":" +
                    config.get("App.webServer.port") +
                    config.get("App.restApiEndpoint.version2ContactPath");

contactsRouter.get("/", function(req,res){

    request.get( {
        url: restEndpoint
    }, function(err, response, body){
        if(!err && response.statusCode === 200){
            var rows = JSON.parse(body);
            
            res.render("pages/contacts", {
            rows: rows,
            restEndpoint: restEndpoint
        });
        }
    });
});


module.exports = contactsRouter;