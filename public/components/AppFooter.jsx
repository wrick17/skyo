var React = require('react'),
    MusicPlayer = require('./MusicPlayer.jsx');

var AppFooter = React.createClass({

  render: function() {
    return (
      <footer>
        <MusicPlayer
          musicUrl={this.props.musicUrl}
          shuffle={this.props.shuffle}
          playNextSong={this.props.playNextSong}
          pollPosition={this.props.pollPosition}
          songPosition={this.props.songPosition}
          repeat={this.props.repeat}
          changeRepeatMode={this.props.changeRepeatMode}
          playPrevSong={this.props.playPrevSong}
          toggleShuffle={this.props.toggleShuffle}
          resetPlayer={this.props.resetPlayer}
          resetPlayerComplete={this.props.resetPlayerComplete} />
      </footer>
    );
  }

});

module.exports = AppFooter;
