var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/packtdb', {useNewUrlParser: true}, function(err,res){
    if(err){
        console.log('Error connection to localhost/packtdb');
        return;
    } else
        console.log('Connected to localhost/packtdb');
});

var contactPersonSchema = new mongoose.Schema({
    contactId : Number,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    imagePath: String
});

var contactPerson = mongoose.model('contactPerson', contactPersonSchema, 'contactPerson');

var mysql = require('mysql');

var connection = mysql.createConnection (config.get('MySQL'));

connection.connect();

function readMySQLContactPerson() {
    connection.query('SELECT * FROM contact_person',
        function (err, rows){
            if (err) {
                console.log('Error Reading MySQL database');
                return;
            }
            
        for (var i = 0; i < rows.length; i++) {
            saveMongoDBContactPerson(rows[i]);
        }
        });
}

function saveMongoDBContactPerson(contact){
    var newContact = new contactPerson({
        contactId: contact.contactId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        imagePath: contact.imagePath
    });

    newContact.save(function(err){
        if(err) {
            console.log('Error adding record to MongoDB');
            return;
        }
        console.log(JSON.stringify(newContact, " ", 2));
    });
}

readMySQLContactPerson();