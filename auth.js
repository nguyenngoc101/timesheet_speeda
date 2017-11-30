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

    //cookie.domain == "wsm.framgia.vn"
    //cookie.name == "_wsm_02_session"
    function getCookie(domain, name, callback) {
        chrome.cookies.getAll({}, function(cookies) {
                cookies.forEach(function (cookie) {
                    if (cookie.domain == domain && cookie.name == name) {
                       callback(cookie)
                       return;
                    };
                });
            callback(null);
        });
    }

    // export module
    return {
        getToken: getToken,
        getCookie: getCookie
    }
})();
