var React = require('react'),
    mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
    AppBar = mui.AppBar,
    Snackbar = mui.Snackbar,
    Paper = mui.Paper;

var AppHeader = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  getInitialState: function() {
    return {
      isUploading: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if(nextProps.uploadProgress === 'done') {
      var that = this;
      setTimeout(function() {
        that.setState({isUploading: false});
        that.refs.progress.dismiss();
      }, 1000);
    }
  },

  handleTouch: function() {
    if(!this.state.isUploading)
      return React.findDOMNode(this.refs.upload).click();
    this.refs.progress.show();
  },

  handleUpload: function() {
    if (React.findDOMNode(this.refs.upload).files.length > 0) {
      this.props.handleUpload(React.findDOMNode(this.refs.upload));
      this.setState({isUploading: true});
      this.refs.progress.show();
    }
  },

  showSnack: function() {
    var credsSnack = this.refs.creds;
    credsSnack.show();
    setTimeout(function() {
      credsSnack.dismiss();
    }, 2000);
  },

  render: function() {
    var progresMessage = this.props.uploadProgress + '% uploaded';
    if (this.props.uploadProgress === 100)
      progresMessage = 'Syncing with the cloud';
    if (this.props.uploadProgress === 'done')
      progresMessage = 'Done';
    return (
      <header>
        <AppBar
          title={this.props.title}
          iconClassNameRight="mdi mdi-cloud-upload"
          onRightIconButtonTouchTap={this.handleTouch}
          onLeftIconButtonTouchTap={this.showSnack} />
        <input type="file" ref="upload" accept=".mp3" onChange={this.handleUpload} style={{display: 'none'}} />
        <Snackbar
          ref="progress"
          message={progresMessage} />
        <Snackbar
          ref="creds"
          message="Thanks for using Syko" />
      </header>
    );
  }

});

module.exports = AppHeader;
