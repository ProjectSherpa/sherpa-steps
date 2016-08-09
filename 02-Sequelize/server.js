const express = require('express');
const app = express();
const Sequelize = require('sequelize');

var db = new Sequelize('sstest', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

var Message = db.define('message', {
  text: {
    type: Sequelize.STRING
  },
  author: {
    type: Sequelize.STRING
  }
});

Message.sync({force: true}).then(function() {
  return Message.create({
      text: 'Goodbye World',
      author: 'Abe'
    });
});

db.authenticate()
  .then(function(err) {
    console.log('Connection has been successfully handled');
  })
  .catch(function(err) {
    console.log('Unable to connec to the database', err);
  })

app.use(express.static('public'));

app.get('/messages', function(req, res) {
  Message.findAll()
    .then(function(messages) {
      res.send(messages);
    })
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
