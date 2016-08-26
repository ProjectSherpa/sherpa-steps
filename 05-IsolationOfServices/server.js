const express = require('express');
const mysql = require('mysql');
const Sequelize = require('sequelize');
const async = require('async');

const app = express();

app.set('port', process.env.PORT || 8080);
app.use(express.static('public'));

const env = process.env.NODE_ENV || 'development';
const host = process.env.RDS_HOSTNAME || 'localhost';
const user = process.env.RDS_USERNAME || 'root';
const password = process.env.RDS_PASSWORD || '';
const port = process.env.RDS_PORT || '';

if ('development' === env) {
  console.log('Using development settings.');
  app.set('connection', mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '',
    password: ''
  }));
}

if ('production' === env) {
  console.log('Using production settings.');
  app.set('connection', mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
  }));
}

const init = function(){

  // Routing
  app.get('/video', function(req, res) {
    var videoName = 'HR Video Part 2'
    console.log('start query', new Date());
    Metadata.findAll({where: {
      name: videoName
    }}).then(function(metadata) {
        VideoLocation.findOne({where: {
          videoId: metadata[0].videoId
        }}).then(function(location) {
          console.log('finish query', new Date());
          res.redirect('/' + location.path);
        })
      })
  });

  // Database setup
  var db = new Sequelize('sherpa', user, password, {
    host: host,
    dialect: 'mysql',
  });

  var Video = db.define('video', {
    uniqueId: Sequelize.STRING
  });

  var VideoLocation = db.define('videolocation', {
    path: Sequelize.STRING
  });

  var Metadata = db.define('metadata', {
    name: Sequelize.STRING
  });

  // Video.hasOne(Metadata);
  Metadata.belongsTo(Video);

  // Video.hasOne(VideoLocation);
  VideoLocation.belongsTo(Video);

  db.authenticate()
    .then(function(err) {
      console.log('Connection has been successfully handled');
    })
    .catch(function(err) {
      console.log('Unable to connec to the database', err);
    })

  Video.sync().then(function() {
    Metadata.sync().then(function() {
      VideoLocation.sync().then(function() {
        return Video.create({
          uniqueId: '879dj31lkj'
        })
        .then(function(video) {
          Metadata.create({
            name: 'HR Video Part 2',
            videoId: video.id
          })
          .then(function(metadata) {
            VideoLocation.create({
              path: 'videos/filename2.mov',
              videoId: video.id
            });
            console.log('sucessfully created metatadata')
          })
        })
      });
    });
  });

  // Start server
  app.listen(app.get('port'), function(err) {
    console.log('Listening on port ' + app.get('port'));
  });
}

// Database initialization
var sqlConnection = app.get('connection');

async.series([
  function connect(callback) {
    sqlConnection.connect(callback);
  },
  function clear(callback) {
    sqlConnection.query('DROP DATABASE IF EXISTS sherpa', callback);
  },
  function create_db(callback) {
    sqlConnection.query('CREATE DATABASE sherpa', callback);
  },
], function(err, results) {
  if (err) {
    console.log('Exception initializing database.');
    init();
    throw err;
  } else {
    console.log('Database initialization complete.');
    init();
  }
});
