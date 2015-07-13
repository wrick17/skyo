var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  superagent = require('superagent'),
  multiparty = require('multiparty'),
  songlist = require('./songlist'),
  drive = require('./drive'),
  regExp = new RegExp('(.+)&export=download'),
  app = express();

app.use(express.static(path.join('./public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/about', function(req, res) {
  res.render('about', {
    title: 'Syko Music'
  });
});


app.get('/', function(req, res) {
  res.render('main');
});

app.get('/api/musicList', function(req, res) {
  var token = req.query.token;

  drive.getFiles(token, function(err, data) {
    if (err) return res.send(err);

    function getSongs(sykoFolder) {
      var songs = [];

      var count = 0;
      for (var i = 0; i < data.items.length; i++) {
        var item = data.items[i];
        if(item.parents[0] && item.parents[0].id === sykoFolder.id && item.labels.trashed === false) {
          songs.push({
            id: count++,
            title: item.title,
            fileId: item.id,
            src: item.webContentLink.match(regExp)[1]
          });
        }
      };
      res.send({'songs': songs, 'folder': sykoFolder});
    }

    var sykoFolderId, sykoFolder;

    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i];
      if(item.title === 'syko' && item.labels.trashed === false) {
        sykoFolderId = item.id;
        sykoFolder = item;
        getSongs(sykoFolder);
      }
    };

    if (!sykoFolderId) {
      drive.createSykoFolder(token, function(err, data) {
        sykoFolder = data;
        sykoFolderId = sykoFolder.id;
        res.send([], sykoFolder);
      });
    }

  });

});

app.post('/api/audio', function(req, res) {

  var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }

    drive.insertFile(fields.token, files.file[0], JSON.parse(fields.folder), function(data) {
      if (err) return console.log(err);
      res.send(data);
    });

  });

});

app.post('/api/delete', function(req, res) {

  var token = req.query.token;
  var fileId = req.query.deleteId;

  drive.trashFile(token, fileId, function(err, resp) {
    res.send(resp);
  });

});

var server = app.listen(process.env.PORT || 3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
