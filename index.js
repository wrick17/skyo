var fs = require('fs'),
  express = require('express'),
  multer = require('multer'),
  path = require('path'),
  lessMiddleware = require('less-middleware'),
  bodyParser = require('body-parser'),
  songlist = require('./songlist.js'),
  app = express(),

  size = 0,
  currentSize = 0,
  percent = 0,
  done = false;

app.use(lessMiddleware('/less', {
  dest: '/css',
  pathRoot: path.join('./public')
}));
app.use(express.static(path.join('./public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(multer({
  inMemory: true,
  dest: './public/music',
  rename: function (fieldname, filename, req, res) {
    return Date.now()
  },
  onFileUploadComplete: function(file) {
    done = true;
    percent = 0;
    size = 0;
    currentSize = 0;
    fs.writeFileSync('./public/music/'+file.name, file.buffer);
  }
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

  songlist('./public/music', function(data) {
    res.send(data);
  });

});

app.post('/api/audio', function(req, res) {
  if (done == true) {
    res.redirect('/');
  }
});

app.post('/api/delete', function(req, res) {
  fs.unlink('./public/music/' + req.body.deleteId, function(err) {
    if (err) throw err;
    console.log('successfully deleted');
    res.redirect('/');
  });
});

var server = app.listen(process.env.PORT || 3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
