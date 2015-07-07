var React = require('react'),
    mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
    Slider = mui.Slider,
    IconButton = mui.IconButton,
    FontIcon = mui.FontIcon,
    AppButtonRound = require('./AppButtonRound.jsx');

function _toMinutes(seconds) {
  seconds = parseInt(seconds);
  if(isNaN(seconds))
    return '0:00';
  if (seconds < 10)
    return '0:0' + Math.floor(seconds);
  if (seconds < 60)
    return '0:' + Math.floor(seconds);
  var minutes = seconds / 60,
      remainingSeconds = seconds % 60;
  if (Math.floor(remainingSeconds) < 10)
    remainingSeconds = '0' + Math.floor(remainingSeconds);
  else if (Math.floor(remainingSeconds) < 60)
    remainingSeconds = Math.floor(remainingSeconds);
  return Math.floor(minutes) + ':' + remainingSeconds;
}

var MusicSlider = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  render: function() {
    var seek = (parseInt(this.props.currentTime) / parseInt(this.props.duration));
    return (
      <Slider style={{height: '12px', backgroundColor: 'transparent', top: '-12px'}} name="audioSlider" onChange={this.props.onChange} step={0.0001} value={seek} />
    );
  }

});

var MusicPlayer = React.createClass({

childContextTypes: {
  muiTheme: React.PropTypes.object
},

getChildContext: function() {
  return {
    muiTheme: ThemeManager.getCurrentTheme()
  };
},

getInitialState: function() {
    return ({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      currentSong: undefined,
      playDisabled: true,
      repeat: this.props.repeat,
      shuffle: this.props.shuffle
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({repeat: nextProps.repeat, shuffle: nextProps.shuffle, currentTime: nextProps.songPosition});
    if(Math.ceil(nextProps.songPosition) === 0)
      React.findDOMNode(this.refs.audio).currentTime = nextProps.songPosition;
    if (this.props.musicUrl !== nextProps.musicUrl) {
      this.setState({
        currentSong: nextProps.musicUrl,
        isPlaying: true,
        playDisabled: false});
      this.checkSlider();
    }
    if(this.props.resetPlayer) {
      this.stopAudio();
      this.setState({currentSong: undefined, playDisabled: true});
      this.props.resetPlayerComplete();
    }
  },

  seek: function(e, value) {
    var audioEl = React.findDOMNode(this.refs.audio);
    this.pauseAudio();
    audioEl.currentTime = (value*this.state.duration);
    this.playAudio();
  },

  checkSlider: function() {
    var audioEl = React.findDOMNode(this.refs.audio);
    var that = this;
    that.setState({duration: audioEl.duration, currentTime: audioEl.currentTime});
    setInterval(function() {
      that.setState({duration: audioEl.duration, currentTime: audioEl.currentTime});
      that.props.pollPosition(that.state.currentTime);
      if (audioEl.currentTime === that.state.duration) {
        if (that.state.repeat === 'continuous' || that.state.repeat === 'none')
          return that.props.playNextSong();
        if (that.state.repeat === 'single')
          that.repeatAudio();
      }
    }, 500);
  },

  playAudio: function() {
    var audioEl = React.findDOMNode(this.refs.audio);
    audioEl.play();
    var that = this;
    this.checkSlider();
    that.setState({isPlaying: true});
  },

  pauseAudio: function() {
    var audioEl = React.findDOMNode(this.refs.audio);
    audioEl.pause();
    var that = this;
    that.setState({isPlaying: false});
  },

  repeatAudio: function() {
    var audioEl = React.findDOMNode(this.refs.audio);
    audioEl.currentTime = 1;
    audioEl.play();
    this.checkSlider();
  },

  stopAudio: function() {
    var audioEl = React.findDOMNode(this.refs.audio);
    audioEl.pause();
    audioEl.currentTime = 1;
    this.setState({currentTime: audioEl.currentTime});
    var that = this;
    that.setState({isPlaying: false});
  },

  render: function() {
    return (
      <div className="music-player">
        <audio ref="audio" id="audio-player" autoPlay src={this.state.currentSong}></audio>
        <MusicSlider currentTime={this.state.currentTime} duration={this.state.duration} onChange={this.seek} defaultValue={1} />
        <div className="audio-controls">
          <span className="song-current" style={{float: 'left', width: '50px', textAlign: 'center'}}>{_toMinutes(this.state.currentTime)}</span>
          <IconButton
            onClick = {this.props.changeRepeatMode}
            style={{
              bottom: '8px',
              height: '36px',
              width: '36px',
              padding: '0'
            }}>
            { (this.state.repeat === 'continuous') ? <FontIcon title="continuous" className="mdi mdi-repeat" style={{color: '#00BCD4'}} /> : null }
            { (this.state.repeat === 'single') ? <FontIcon title="repeat single" className="mdi mdi-repeat-once" style={{color: '#00BCD4'}} /> : null }
            { (this.state.repeat === 'none') ? <FontIcon title="no repeat" className="mdi mdi-repeat-off" /> : null }
          </IconButton>
          <AppButtonRound iconClassName="mdi mdi-skip-previous" onClick={this.props.playPrevSong} disabled={this.state.playDisabled} />
          { this.state.isPlaying ? null : <AppButtonRound iconClassName="mdi mdi-play" onClick={this.playAudio} disabled={this.state.playDisabled} /> }
          { this.state.isPlaying ? <AppButtonRound iconClassName="mdi mdi-pause" onClick={this.pauseAudio} /> : null }
          <AppButtonRound iconClassName="mdi mdi-skip-next" onClick={this.props.playNextSong} disabled={this.state.playDisabled} />
          <IconButton
            style={{
              bottom: '8px',
              height: '36px',
              width: '36px',
              padding: '0'
            }}
            onClick={this.props.toggleShuffle}>
            { this.state.shuffle ? null : <FontIcon className="mdi mdi-shuffle" title="shuffle off" /> }
            { this.state.shuffle ? <FontIcon className="mdi mdi-shuffle" style={{color: '#00BCD4'}} title="shuffle on" /> : null }
          </IconButton>
          <span className="song-duration" style={{float: 'right', width: '50px', textAlign: 'center'}}>{_toMinutes(this.state.duration)}</span>
        </div>
      </div>
    );
  }
});

module.exports = MusicPlayer;
