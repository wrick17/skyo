var CLIENT_ID = '560257946602-48ce4j6lpcudfgv6175gegqvobfg86gt.apps.googleusercontent.com'; // heroku key
// var CLIENT_ID = '560257946602-7c38d7c8oroevmkamo10jtgssmcten6k.apps.googleusercontent.com'; // localhost:3000 key
var SCOPES = [
  'https://www.googleapis.com/auth/drive'
];
window.initial = true;

/**
 * Called when the client library is loaded.
 */
function handleClientLoad() {
  checkAuth();

  setInterval(function() {
    if (localStorage.getItem('expire') < ((Date.now()/1000)))
      checkAuth();
  } , 1000);
}

/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
  gapi.auth.authorize({
      'client_id': CLIENT_ID,
      'scope': SCOPES,
      'immediate': true
    },
    handleAuthResult);
}

/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  if (authResult) {
    console.log(authResult);
    localStorage.setItem('token', authResult.access_token);
    localStorage.setItem('expire', authResult.expires_at);
    if (window.initial)
      window.init();
    window.initial = false;
    // Access token has been successfully retrieved, requests can be sent to the API
  } else {
    // No access token could be retrieved, force the authorization flow.
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': false
      },
      handleAuthResult);
  }
}