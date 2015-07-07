var React = require('react'),
    mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
    List = mui.List,
    ListItem = mui.ListItem,
    FontIcon = mui.FontIcon,
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
      return extProps.resetPlayerComplete();
    }
    this.setState({currentSongId: nextProps.currentSongId})
  },

  playSong: function(e) {
    var songId = e.target.parentElement.parentElement.parentElement.lastChild.dataset.id;
    this.props.playSong(songId);
  },

  deleteSong: function(e) {
    var fileName = e.target.parentElement.parentElement.parentElement.lastChild.dataset.name;
    var songId = e.target.parentElement.parentElement.parentElement.lastChild.dataset.id;
    if (songId == this.state.currentSongId) return;
    this.props.handleDelete(fileName);
  },

  render: function() {
    var that = this;
    var songList = this.props.data.map(function (song) {

      return (
        <ListItem style={{padding: '12px', borderBottom: '1px solid #f0f0f0'}} disableTouchTap={true} key={song.id} >
          <span style={{
            textOverflow: 'ellipsis',
            maxWidth: '75%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            display: 'block',
            float: 'left'
            }}>
            {song.meta.title}
          </span>
          <IconButton
            onClick={that.deleteSong}
            style={{
              padding: '0 !important',
              height: '24px',
              width: '24px',
              float: 'right',
              verticalAlign: 'sub'}}>
              { (that.props.currentSongId == song.id) ? null : <FontIcon className="mdi mdi-delete" color="#999" hoverColor="#555" /> }
              { (that.props.currentSongId == song.id) ? <FontIcon className="mdi mdi-delete" color="#ddd" /> : null }
          </IconButton>
          { (that.props.currentSongId == song.id) ? null : <IconButton
            onClick={that.playSong}
            style={{
              padding: '0 !important',
              marginRight: '10px',
              height: '24px',
              width: '24px',
              float: 'right',
              verticalAlign: 'sub'}}>
              <FontIcon className="mdi mdi-play-circle-outline" color="#555" />
          </IconButton> }
          { (that.props.currentSongId == song.id) ? <IconButton
            style={{
              padding: '0 !important',
              marginRight: '10px',
              height: '24px',
              width: '24px',
              float: 'right',
              verticalAlign: 'sub'}}>
              <FontIcon className="mdi mdi-volume-high" color="#333" />
          </IconButton> : null}
          <input data-id={song.id} data-name={song.name} style={{display: 'none'}} />
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
      <MuiList
        data={this.props.data}
        playSong={this.props.playSong}
        currentSongId={this.props.currentSongId}
        resetPlayer={this.props.resetPlayer}
        resetPlayerComplete={this.props.resetPlayerComplete}
        handleDelete={this.props.handleDelete} />
    );
  }
});

module.exports = MusicList;
