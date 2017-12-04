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

    //cookie.domain == "wsm.framgia.vn"
    //cookie.name == "_wsm_02_session"
    function getCookie(domain, name, callback) {
        let wsmCookie;
        chrome.cookies.getAll({}, function (cookies) {
            cookies.forEach(function (cookie) {
                if (cookie.domain == domain && cookie.name == name) {
                    wsmCookie = cookie;
                    return;
                }
            });
            !wsmCookie ? callback(null) : callback(wsmCookie);
        });
    }

    // export module
    return {
        getToken: getToken,
        getCookie: getCookie,
        getEmail: getEmail
    }
})();
