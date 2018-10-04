var mysql = require('mysql');
var config = require("config");

var connection = mysql.createConnection(config.get('MySQL'));
    
var Contacts = function() {
	connection.connect();
};

function recordNotFound(message) {
	Error.call(this);
	this.message = message;
	this.status = 404;
}

Contacts.prototype.get = function(contactId, callback) {
	var id = parseInt(contactId);

	connection.query('SELECT * FROM contact_person WHERE contactId=?',
		[id],
		function(err, rows, fields) {
			if (!err) {
				if (rows.length > 0) {
					callback(null, rows);
				} else {
					callback(new recordNotFound('Record does not exist!'),
						{message: 'Record does not exist!'});
				}
			} else {
				callback(err, null);
			}
		});
};

Contacts.prototype.getAll = function(callback) {
	connection.query('SELECT * FROM contact_person',
		function(err, rows, fields) {
			if (!err) {
				callback(null, rows);
			} else {
				callback(err, null);
			}
		});
};

Contacts.prototype.append = function(contact, callback) {
	try {
		connection.query(
			'INSERT INTO contact_person (firstName, lastName, email, phone, imagePath) ' +
			'VALUES (?, ?, ?, ?, ?)',
			[contact.firstName, contact.lastName, contact.email, contact.phone, contact.imagePath],
			function(err, rows) {
				if (err) {
					console.log(JSON.stringify(err));
					callback(err);
				} else {
					callback(null);
				}
			}
		);
	} catch (err) {
		callback(err);
	}
};

Contacts.prototype.save = function(contact, callback) {
	try {
		var id = parseInt(contact.contactId);

		connection.query(
			'UPDATE contact_person SET firstName=?, lastName=?, email=?' +
			', phone=?, imagePath=? WHERE contactId=?',
			[contact.firstName, contact.lastName, contact.email, contact.phone, contact.imagePath, id],
			function(err, rows) {
				if (err) {
					console.log(JSON.stringify(err));
					callback(err);
				} else {
					callback(null);
				}
			}
		);
	} catch (err) {
		callback(err);
	}
};

Contacts.prototype.delete = function(contactId, callback) {
	try {
		connection.query(
			'DELETE FROM contact_person WHERE contactId=?',
			[contactId],
			function(err, rows) {
				if (err) {
					console.log(JSON.stringify(err));
					callback(err);
				} else {
					callback(null);
				}
			}
		);
	} catch (err) {
		callback(err);
	}
};

module.exports = Contacts;
