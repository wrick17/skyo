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

  document.querySelector(".upload").onchange = function () {
    if (this.value !== ''){
      document.querySelector(".upload-button").setAttribute("disabled", "disabled");
      document.querySelector(".upload-button").innerHTML = this.value;
    }
    else {
      document.querySelector(".upload-button").removeAttribute("disabled");
      document.querySelector(".upload-button").innerHTML = 'Upload';
    }

  };

})();