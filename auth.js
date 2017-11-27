'use strict';


var auth = (function() {
    function getToken(callback) {
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        if (chrome.runtime.lastError) {
          callback(chrome.runtime.lastError);
          return;
        }
        callback(null, token);
      });
    }

    // export module
    return {
        getToken: getToken
    }
})();
