var React = require('react'),
    mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
    List = mui.List,
    ListItem = mui.ListItem,
    IconButton = mui.IconButton,
    AppButtonRound = require('./AppButtonRound.jsx');

var MuiList = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      currentSongId: this.props.currentSongId
    };
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.resetPlayer) {
      this.setState({currentSongId: undefined});
      nextProps.resetPlayerComplete();
    }
  },

  handleClick: function(e) {
    var fileName = e.target.parentElement.parentElement.parentElement.lastChild.dataset.value;
    this.props.playSong(fileName);
  },

  render: function() {
    var that = this;
    var songList = this.props.data.map(function (song) {

      return (
        <ListItem style={{padding: '12px', borderBottom: '1px solid #f0f0f0'}} disableTouchTap={true} key={song.id} >
          <span>{song.meta.title}</span>
          { (that.props.currentSongId == song.id) ? null : <IconButton
            onClick={that.handleClick}
            iconClassName="mdi mdi-play-circle-outline"
            style={{
              padding: '0 !important',
              marginRight: '12px',
              height: '24px',
              width: '24px',
              float: 'right',
              verticalAlign: 'sub'}} /> }
          { (that.props.currentSongId == song.id) ? <IconButton
            iconClassName="mdi mdi-volume-high"
            style={{
              padding: '0 !important',
              marginRight: '12px',
              height: '24px',
              width: '24px',
              float: 'right',
              verticalAlign: 'sub'}} /> : null}
          <input data-value={song.id} style={{display: 'none'}} />
          </ListItem>
      );
    });
    return (
      <List>
        {songList}
      </List>
    );
  }

});


var MusicList = React.createClass({
  render: function() {
    return (
      <MuiList data={this.props.data} playSong={this.props.playSong} currentSongId={this.props.currentSongId} resetPlayer={this.props.resetPlayer} resetPlayerComplete={this.props.resetPlayerComplete} />
    );
  }
});

module.exports = MusicList;
