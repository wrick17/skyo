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
        if(!err)
        callback(data.body);
      });
  }

  getSongData(function(data){

    var playlist = {}, i;
    for (i = 0; i < data.length; i++) {
      playlist[data[i].id] = data[i].name;
    }

    var Syko = React.createClass({

      getInitialState: function() {
        return {
          currentSong: null,
          currentSongId: null,
          playlist: playlist,
          shuffle: false,
          repeat: 'continuous',
          resetPlayer: false,
          songPosition: 0
        };
      },

      resetPlayerComplete: function() {
        this.setState({
          resetPlayer: false
        });
      },

      pollPosition: function(currentTime) {
        this.setState({songPosition: currentTime});
      },

      toggleShuffle: function() {
        this.setState({shuffle: !this.state.shuffle});
      },

      shufflePlay: function() {
        function shuffle(min, max) {
          return Math.floor((Math.random() * max) + min);
        }

        var nextSongId = shuffle(0, i);

        if(this.state.currentSongId === nextSongId)
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
        if(this.state.songPosition > 10 || this.state.repeat === 'single')
          return this.playSong(this.state.currentSongId);

        if (this.state.shuffle)
          return this.shufflePlay();

        if(this.state.currentSongId > 0)
          return this.playSong(parseInt(this.state.currentSongId)-1);

        if(this.state.repeat === 'none')
          return this.playSong(0);

        this.playSong(i-1);
      },

      render: function() {
        return (
          <div>
            <AppHeader title="Syko" />
            <AppBody
              data={data}
              playSong={this.playSong}
              currentSongId={this.state.currentSongId}
              resetPlayer={this.state.resetPlayer}
              resetPlayerComplete={this.resetPlayerComplete} />
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
