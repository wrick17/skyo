window.init = function(token) {

  var React = require('react'),
      superagent = require('superagent'),
      AppHeader = require('./AppHeader.jsx'),
      AppFooter = require('./AppFooter.jsx'),
      AppBody = require('./AppBody.jsx'),
      injectTapEventPlugin = require("react-tap-event-plugin");

  injectTapEventPlugin();

  function getSongData(callback) {
    superagent
      .get('/api/musicList')
      .query({token : token})
      .end(function(err, res) {

        if (err) throw new Error(err);

        console.log(JSON.parse(res.text));

        var sykoFolder = JSON.parse(res.text).folder;
        var songList = JSON.parse(res.text).songs;

        var playlist = {}, songCount;
        for (songCount = 0; songCount < songList.length; songCount++) {
          playlist[songList[songCount].id] = songList[songCount].src;
        }

        callback(songList, playlist, songCount, sykoFolder);
      });
  }

  var Syko = React.createClass({

    getInitialState: function() {
      return {
        currentSong: null,
        currentSongId: null,
        data: [],
        playlist: [],
        shuffle: false,
        folder: null,
        repeat: 'continuous',
        resetPlayer: false,
        songPosition: 0,
        uploadProgress: 0,
        repeatSong: false,
        songCount: 0
      };
    },

    componentDidMount: function() {
      var that = this;
      getSongData(function(data, playlist, songCount, sykoFolder) {
        that.setState({
          data: data,
          playlist: playlist,
          songCount: songCount,
          sykoFolder: JSON.stringify(sykoFolder)
        });
      });
    },

    resetPlayerComplete: function() {
      this.setState({
        resetPlayer: false
      });
    },

    pollPosition: function(currentTime) {
      this.currentTime = currentTime;
    },

    toggleShuffle: function() {
      this.setState({shuffle: !this.state.shuffle});
    },

    shufflePlay: function() {
      function shuffle(min, max) {
        return Math.floor((Math.random() * max) + min);
      }

      var nextSongId = shuffle(0, this.state.songCount);

      if(this.state.currentSongId == nextSongId)
        return this.shufflePlay();

      this.playSong(nextSongId);
    },

    changeRepeatMode: function() {
      if(this.state.repeat === 'continuous')
        return this.setState({repeat: 'single'});

      if(this.state.repeat === 'single')
        return this.setState({repeat: 'none'});

      return this.setState({repeat: 'continuous'});
    },

    playSong: function(songId) {
      if (songId == this.state.currentSongId) {
        this.setState({currentSong: this.state.playlist[songId], repeatSong: true});
        this.setState({repeatSong: false});
      }

      this.setState({currentSong: this.state.playlist[songId], currentSongId: songId});
    },

    playNextSong: function() {
      if(this.state.repeat === 'single')
        return this.playSong(this.state.currentSongId);

      if (this.state.shuffle)
        return this.shufflePlay();

      if(this.state.currentSongId < (this.state.songCount-1))
        return this.playSong(parseInt(this.state.currentSongId)+1);

      if(this.state.repeat === 'none')
        return this.setState({currentSongId: null, resetPlayer: true});

      this.playSong(0);
    },

    playPrevSong: function() {
      if(this.currentTime > 10 || this.state.repeat === 'single')
        return this.playSong(this.state.currentSongId);

      if (this.state.shuffle)
        return this.shufflePlay();

      if(this.state.currentSongId > 0)
        return this.playSong(parseInt(this.state.currentSongId)-1);

      if(this.state.repeat === 'none')
        return this.playSong(0);

      this.playSong(this.state.songCount-1);
    },

    handleUpload: function(uploadEl) {
      var that = this;
      superagent
        .post('/api/audio')
        .field('token', token)
        .field('filename', uploadEl.files[0].name)
        .field('folder', this.state.folder)
        .attach('file', uploadEl.files[0], uploadEl.files[0].name)
        .on('progress', function(e) {
          that.setState({uploadProgress: Math.floor(e.percent)});
        })
        .end(function(err, res){
          if (err) throw new Error(err);
          that.setState({uploadProgress: 'done'});
          getSongData(function(data, playlist) {
            that.setState({data: data, playlist: playlist});
          });
        });
    },

    handleDelete: function(fileId) {
      var that = this;
      superagent
        .post('/api/delete')
        .query({token : token})
        .query({deleteId: fileId})
        .end(function(err, res) {
          if (err) throw new Error(err);
          getSongData(function(data, playlist) {
            that.setState({data: data, playlist: playlist});
          });
        });
    },

    render: function() {
      return (
        <div>
          <AppHeader title="Syko"
            handleTouch={this.handleTouch}
            handleUpload={this.handleUpload}
            uploadProgress={this.state.uploadProgress} />
          <AppBody
            data={this.state.data}
            playSong={this.playSong}
            currentSongId={this.state.currentSongId}
            resetPlayer={this.state.resetPlayer}
            resetPlayerComplete={this.resetPlayerComplete}
            handleDelete={this.handleDelete} />
          <AppFooter
            musicUrl={this.state.currentSong}
            playNextSong={this.playNextSong}
            playPrevSong={this.playPrevSong}
            repeatSong={this.state.repeatSong}
            pollPosition={this.pollPosition}
            songPosition={this.state.songPosition}
            repeat={this.state.repeat}
            changeRepeatMode={this.changeRepeatMode}
            shuffle={this.state.shuffle}
            toggleShuffle={this.toggleShuffle}
            resetPlayer={this.state.resetPlayer}
            resetPlayerComplete={this.resetPlayerComplete} />
        </div>
      );
    }

  });

  React.render( <Syko />, document.getElementById('content') );

}