var React = require('react'),
    mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
    AppBar = mui.AppBar;

var AppHeader = React.createClass({

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
      <header>
        <AppBar title={this.props.title} />
      </header>
    );
  }

});

module.exports = AppHeader;
