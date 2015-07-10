var CLIENT_ID = '560257946602-48ce4j6lpcudfgv6175gegqvobfg86gt.apps.googleusercontent.com';
// var CLIENT_ID = '560257946602-7c38d7c8oroevmkamo10jtgssmcten6k.apps.googleusercontent.com';
var SCOPES = [
  'https://www.googleapis.com/auth/drive'
];

/**
 * Called when the client library is loaded.
 */
function handleClientLoad() {
  if (!localStorage.getItem('token'))
    return checkAuth();
  window.init(localStorage.getItem('token'));
}

/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
  gapi.auth.authorize({
      'client_id': CLIENT_ID,
      'scope': SCOPES,
      'immediate': false
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
    // console.log(authResult);
    localStorage.setItem('token', authResult.access_token);
    window.init(authResult.access_token);
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