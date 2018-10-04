var express = require("express");
var request = require("request");
var config = require("config");

var profileRouter = express.Router();

var restEndpoint = config.get('App.webServer.protocol') + '://' +
					config.get('App.webServer.host') + ':' +
					config.get('App.webServer.port') +
					config.get('App.restApiEndpoint.version2ContactPath');



profileRouter.get("/", function(req,res){
    var newContact = {
            contactId: null,
            firstName: null,
            lastName: null,
            email:null,
            phone:null,
            imagePath:null
    };
    res.render("pages/profile", {
        newRecord: true, 
        contact: newContact,
        restEndpoint: restEndpoint
    });
});

profileRouter.get("/:contactId", function(req,res){
    
    request.get({
        url: restEndpoint + '/' + req.params.contactId 
    }, function(err, response, body) {
        if(!err && response.statusCode === 200){
            var oldContact = JSON.parse(body)[0];  
    res.render("pages/profile", { 
              newRecord: false, 
              contact: oldContact,
              restEndpoint: restEndpoint
            });
     }
    });
});

module.exports = profileRouter;