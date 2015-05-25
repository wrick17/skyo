var fs = require('fs'),
    express = require('express'),
    multer = require('multer'),
    bodyParser = require('body-parser'),
    songlist = require('./songlist.js');

var app = express();

var done = false;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({
  dest: './public/music',
  rename: function(fieldname, filename) {
    return filename + Date.now();
  },
  onFileUploadStart: function(file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function(file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    done = true;
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

app.post('/api/audio',function(req,res){
  console.log(req.files);
  if(done == true){
    res.redirect('/');
  }
});

app.post('/api/delete',function(req,res){
  console.log(req.body.deleteId);
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