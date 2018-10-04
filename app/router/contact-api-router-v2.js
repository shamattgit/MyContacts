var express = require("express");
var multer = require("multer");
var path = require("path");
var fs = require("fs");

var contactApiRouter = express.Router();

var Contacts = require('../model/contact-model-mongo');

var contacts = new Contacts();

var storage = multer.diskStorage({
    destination:function(req,res, cb){
        cb(null,'./uploads');
    },
    filename: function(req, file, cb){
        cb(null,(path.parse(file.originalname)).name + "-" + Date.now() + ".png");
    }

});

contactApiRouter.get('/', function(req, res) {
    contacts.getAll(function(err, result){
        if(err) {
            res.status(500).json({message: 'Error retriving data!' });
            return;
        }
        res.status(200).json(result);
    });
});

contactApiRouter.get('/:contactId', function(req,res) {
    var id = parseInt(req.params.contactId);

    contacts.get(id, function(err, result){
        if(err) {
            if(err.status === 404) 
                res.status(404).json({message: 'Record does not exist!'});
            else  
                res.status(500).json({message: 'Error retriving data!' });
            return;
        }
        res.status(200).json(result);
    });
});

contactApiRouter.post('/', multer({storage: storage}).single('imagePath'), function(req,res) {
   var newContact = {
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       email: req.body.email,
       phone: req.body.phone,
       imagePath: req.file !== undefined ? req.file.path: null
   };
   
    contacts.append(newContact, function(err, result){
        if(err) {
            res.status(500).json({message: 'Error appending record!' });
            return;
        }
        res.status(201).json({message: 'Record Appended!'});
    });
});

contactApiRouter.put('/:contactId', multer({storage:storage}).single('imagePath'), function(req,res) {
    var contactId = parseInt(req.params.contactId);
    
    
    contacts.get(contactId, function(err, result){
        if (err) {
            if(err.status === 404) 
                res.status(404).json({message: 'Record does not exist!'});
            else  
                res.status(500).json({message: 'Error retriving data!' });
            return;
        }

        var oldImagePath = result[0].imagePath;

        var oldContact ={
            contactId: contactId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            imagePath: req.file !== undefined ? req.file.path : oldImagePath
        };
        
     contacts.save(oldContact, function(err){
         if(err) {
             res.status(500).json({message: 'Error saving record!' });
             return;
         }
         res.status(201).json({message: 'Record Saved!'});
     });
 });

});

contactApiRouter.delete('/:contactId', function(req, res) {
	var contactId = parseInt(req.params.contactId);

	contacts.get(contactId, function(err, result) {
		if (err) {
			if (err.status === 404)
				res.status(404).json({message: 'Record does not exist!'});
			else
				res.status(500).json({message: 'Error retrieving record!'});
			return;
		}

		contacts.delete(contactId, function(err) {
			if (err) {
				res.status(500).json({message: 'Error deleting record!'});
				return;
			}

			if (result[0].imagePath !== null)
				fs.unlinkSync(result[0].imagePath);

			res.status(204).json({message: 'Record deleted!'});
		});		
	});
});

module.exports = contactApiRouter;