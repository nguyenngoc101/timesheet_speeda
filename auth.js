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
    
    function getEmail(callback) {
        chrome.identity.getProfileUserInfo(function (userInfo) {
            if (chrome.runtime.lastError) {
                callback(chrome.runtime.lastError);
                return;
            }
            callback(null, userInfo.email);
        })
    }

    // export module
    return {
        getToken: getToken,
        getEmail: getEmail
    }
})();
