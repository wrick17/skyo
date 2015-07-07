(function() {

  function clickHandler (e){
    e = e || window.event;
    e.preventDefault();
    var target = e.target || e.srcElement;

    if(target.className.toLowerCase()==='song')
    {
      var song_name = target.dataset.src;

      document.querySelector('#source').src = '/music/'+song_name;
      document.querySelector('#audio-player').load();
      document.querySelector('#audio-player').play();
    }

    if(target.className.toLowerCase()==='remove-button')
    {
      var song_name = target.dataset.src;
      document.querySelector('#delete-filename').value = song_name;
      document.querySelector('#deleteForm').submit();
    }
  }

  document.querySelector('.song-list').addEventListener('click', clickHandler, false);

  document.querySelector('.upload').onchange = function () {
    if (this.value !== ''){
      document.querySelector('.upload-button').setAttribute('disabled', 'disabled');
      document.querySelector('.upload-button').innerHTML = this.files[0].name;
      document.querySelector('.size').value = this.files[0].size;
    }
    else {
      document.querySelector('.upload-button').removeAttribute('disabled');
      document.querySelector('.upload-button').innerHTML = 'Upload';
    }

  };

  document.querySelector('#uploadForm').addEventListener('submit', function (event) {
    // console.log(document.querySelector('.size').value);

    event.preventDefault();

    var superagent = require('superagent');

    superagent
      .post('/api/audio')
      .attach('file', document.querySelector('.upload').files[0], document.querySelector('.upload').files[0].name)
      .field('size', document.querySelector('.size').value)
      .on('progress', function(e) {
        document.querySelector('progress').value = e.percent;
      })
      .end(function(err, res){
        document.querySelector('.upload-button').innerHTML = 'Upload';
        document.querySelector('progress').value = '0';
        document.querySelector('.upload').value = '';
        window.location = '/';
      });

  }, false);


})();