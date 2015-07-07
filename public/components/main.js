(function(){

  'use strict';

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
      .end(function(err, data) {
        if(err) throw new Error(err);
        var playlist = {}, i;
        for (i = 0; i < data.body.length; i++) {
          playlist[data.body[i].id] = data.body[i].name;
        }
        callback(data.body, playlist, i);
      });
  }

  getSongData(function(data, playlist, i){

    var Syko = React.createClass({

      getInitialState: function() {
        return {
          currentSong: null,
          currentSongId: null,
          data: data,
          playlist: playlist,
          shuffle: false,
          repeat: 'continuous',
          resetPlayer: false,
          songPosition: 0,
          uploadProgress: 0
        };
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

        var nextSongId = shuffle(0, i);

        if(this.currentSongId === nextSongId)
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
        this.setState({currentSong: '/music/'+this.state.playlist[songId], currentSongId: songId, songPosition: 0});
      },

      playNextSong: function() {
        if(this.state.repeat === 'single')
          return this.playSong(this.state.currentSongId);

        if (this.state.shuffle)
          return this.shufflePlay();

        if(this.state.currentSongId < (i-1))
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

        this.playSong(i-1);
      },

      handleUpload: function(uploadEl) {
        var that = this;
        superagent
          .post('/api/audio')
          .attach('file', uploadEl.files[0], uploadEl.files[0].name)
          .field('size', uploadEl.files[0].size)
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

      handleDelete: function(songName) {
        var that = this;
        superagent
          .post('/api/delete')
          .field('deleteId', songName)
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

  });


})();
