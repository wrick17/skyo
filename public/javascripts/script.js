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
      document.querySelector('.upload-button').innerHTML = this.value;
      document.querySelector('.size').value = this.files[0].size;
    }
    else {
      document.querySelector('.upload-button').removeAttribute('disabled');
      document.querySelector('.upload-button').innerHTML = 'Upload';
    }

  };

  document.querySelector('#uploadForm').addEventListener('submit', function (event) {
    // console.log(document.querySelector('.size').value);

    superagent
      .post('/api/size')
      .send({size: document.querySelector('.size').value})
      .end(function(err, res){
        console.log(res.text);
      });

    setInterval(function(){
      superagent
        .get('/api/progress')
        .end(function(err, res){
          if (res !== undefined)
            document.querySelector('progress').value = res.status;
        });
    }, 3000);

  }, false);


})();