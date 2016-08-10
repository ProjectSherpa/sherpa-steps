const express = require('express');
const app = express();
const Sequelize = require('sequelize');

// Database setup
var db = new Sequelize('sstest', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

var Video = db.define('video', {
  shortname: Sequelize.STRING
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
        shortname: 'HR Video'
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

// Routing
app.use(express.static('public'));

app.get('/messages', function(req, res) {
  VideoLocation.findAll({where: {
    name:
  }})
    .then(function(vidpath) {
      res.send(vidpath);
    })
});

// Start server
app.listen(3000, function() {
  console.log('Listening on port 3000');
});
