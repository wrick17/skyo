var drive = {},
    superagent = require('superagent'),
    FileAPI = require('file-api'),
    File = FileAPI.File,
    FileList = FileAPI.FileList,
    FileReader = FileAPI.FileReader,
    btoa = require('btoa');


drive.getFiles = function(token, callback) {
  superagent
    .get('https://www.googleapis.com/drive/v2/files')
    .set('Authorization', 'Bearer '+token)
    .set('Content-Type', 'application/json')
    .end(function(err, res) {
      callback(err, res.body);
    });
}

drive.createSykoFolder = function(token, callback) {
  superagent
    .post('https://www.googleapis.com/drive/v2/files')
    .set('Authorization', 'Bearer '+token)
    .set('Content-Type', 'application/json')
    .send('{ "title" : "syko", "mimeType" : "application/vnd.google-apps.folder" }')
    .end(function(err, res) {
      callback(err, res.body);
    });
}

drive.insertFile = function(token, fileData, folder, callback) {

  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  var file = new File(fileData.path);
  reader.readAsBinaryString(file);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var metadata = {
      'title': fileData.originalFilename,
      'mimeType': contentType,
      'parents' : [folder]
    };

    var base64Data = btoa(reader.result);
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    superagent
      .post('https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart')
      .set('Authorization', 'Bearer '+token)
      .set('Content-Type', 'multipart/mixed; boundary="' + boundary + '"')
      .send('{ "body" : "'+ multipartRequestBody +'" }')
      .end(function (err, res) {
        callback(res.body);
      });
  }
}

drive.trashFile = function(token, fileId, callback) {
  superagent
    .post('https://www.googleapis.com/drive/v2/files/'+fileId+'/trash')
    .set('Authorization', 'Bearer '+token)
    .set('Content-Type', 'application/json')
    .end(function(err, res) {
      callback(err, res.body);
    });
}

module.exports = drive;