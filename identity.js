'use strict';

var timeshitLoader = (function() {

  var signin_button;

  function getToken() {
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        if (chrome.runtime.lastError) {
          callback(chrome.runtime.lastError);
          return;
        }
        console.log("token: "+token);

        var url="https://sheets.googleapis.com/v4/spreadsheets/1TY_EK3ezfAuZwklVTGLmCakt6EhwO8IkioWHhUaHu7I/values/Nguyen%20Van%20Ngoc!D4%3AD9?includeValuesInResponse=true&responseDateTimeRenderOption=FORMATTED_STRING&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED";
        var data = {"range":"Nguyen Van Ngoc!D4:D9","majorDimension":"ROWS","values":[["19:55"],["19:55"],["19:55"],["19:55"],["19:59"],["19:59"]]};
        $.ajax({
            url: url,
            type: 'put',
            data: JSON.stringify(data),
            dataType: 'json',
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", 'Bearer ' + token);
                request.setRequestHeader('Content-Type','application/json');
          },
            success: function(result) {
              console.log("OK");
                console.log(JSON.stringify(result));
            },
            error: function (err) {
                console.log(err.responseText);
            }
        });


      });
  }

  function requestStart(access_token, callback) {
    var url="https://sheets.googleapis.com/v4/spreadsheets/1TY_EK3ezfAuZwklVTGLmCakt6EhwO8IkioWHhUaHu7I?includeGridData=true&ranges=Nguyen%20Van%20Ngoc!C4:C9"
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.onload = requestComplete;
    xhr.send();
  }

  function requestComplete(callback) {
      var retry;
    if (this.status == 401 && retry) {
      retry = false;
      chrome.identity.removeCachedAuthToken({ token: access_token },
                                            getToken);
    } else {
      callback(null, this.status, this.response);
    }
  }

  function revokeToken() {
    user_info_div.innerHTML="";
    chrome.identity.getAuthToken({ 'interactive': false },
      function(current_token) {
        if (!chrome.runtime.lastError) {

          // @corecode_begin removeAndRevokeAuthToken
          // @corecode_begin removeCachedAuthToken
          // Remove the local cached token
          chrome.identity.removeCachedAuthToken({ token: current_token },
            function() {});
          // @corecode_end removeCachedAuthToken

          // Make a request to revoke token in the server
          var xhr = new XMLHttpRequest();
          xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
                   current_token);
          xhr.send();
          // @corecode_end removeAndRevokeAuthToken

          // Update the user interface accordingly
          changeState(STATE_START);
          sampleSupport.log('Token revoked and removed from cache. '+
            'Check chrome://identity-internals to confirm.');
        }
    });
  }

  return {
    onload: function () {
      signin_button = document.querySelector('#signin');
      signin_button.addEventListener('click', getToken);
    }
  };

})();


window.onload = timeshitLoader.onload;

