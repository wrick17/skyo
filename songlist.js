var fs = require('fs'),
    async = require('async'),
    id3_reader = require('id3_reader'),
    path = require('path');

module.exports = function(path_name, callback) {
  var song_list = [],
      initial_files = []
      queue = [];

  initial_files = fs.readdirSync(path_name);
  var i = 0;

  async.eachSeries(initial_files, function(file, call) {
    id3_reader.read(path_name + '/' + file, function(err, data) {
      if (path.extname(file) === '.mp3') {
        song_list.push({
          name: file,
          meta: data
        });
        call();
      } else {
        call();
      }
    });
  }, function(data){
    callback(song_list);
  });
}
