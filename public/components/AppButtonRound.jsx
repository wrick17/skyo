var React = require('react'),
    mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
    FloatingActionButton = mui.FloatingActionButton;

var AppButtonRound = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  render: function() {
    return (
      <FloatingActionButton iconClassName={this.props.iconClassName} style={{margin: '0 10px'}} mini={true} secondary={true} onClick={this.props.onClick} disabled={this.props.disabled} />
    );
  }

});

module.exports = AppButtonRound;
