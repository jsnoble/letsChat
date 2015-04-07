
var faker = require('faker');

var allUsers = [];

//Ten servers times one thousand equals the ten thousand unique users requirement
for(var i = 0; i < 1000; i++){
    //generates a user with name, username, avatar, email, DOB, phone, address, website and company
    allUsers.push(faker.helpers.contextualCard())
}

module.exports = allUsers;