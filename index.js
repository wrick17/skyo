var fs = require('fs'),
    express = require('express'),
    multer = require('multer'),
    path  = require('path'),
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({
  dest: './public/music',
  rename: function(fieldname, filename) {
    return filename + Date.now();
  },
  onFileUploadStart: function(file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function(file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    done = true;
    percent = 0; size = 0; currentSize = 0;
  },
  onFileUploadData: function (file, data, req, res) {
    currentSize += parseInt(data.length);
    percent = Math.floor((currentSize/size)*100);
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

  var song_list = songlist('./public/music', function(data) {
    res.render('index', {
      title: 'Syko Music',
      song_list: data
    });
  });

});

app.post('/api/size', function(req, res){
  size = parseInt(req.body.size);
  res.send();
});

app.get('/api/progress', function(req, res){
  console.log(percent);
  if (percent !== 0)
    res.jsonp({'percent': percent});
  else
    res.jsonp({'percent': 0});
});

app.post('/api/audio',function(req,res){
  if(done == true){
    console.log(req.body);
    res.redirect('/');
    // res.send('0');
  }
});

app.post('/api/delete',function(req,res){
  // console.log(req.body.deleteId);
  fs.unlink('./public/music/'+req.body.deleteId, function (err) {
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


// SONGLIST NPM