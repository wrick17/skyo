var React = require('react'),
    MusicList = require('./MusicList.jsx');

var AppBody = React.createClass({
  render: function() {
    return (
      <div className="main">
        <MusicList
          data={this.props.data}
          playSong={this.props.playSong}
          currentSongId={this.props.currentSongId}
          resetPlayer={this.props.resetPlayer}
          resetPlayerComplete={this.props.resetPlayerComplete} />
      </div>
    );
  }
});

module.exports = AppBody;
