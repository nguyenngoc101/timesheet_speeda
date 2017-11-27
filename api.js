/**
 * Created by framgia on 27/11/2017.
 */
'user strict';

var api = function(globalOptions) {

    function update(range, data, options) {

        defaultOptions = {
            includeValuesInResponse: true,
            responseDateTimeRenderOption: "FORMATTED_STRING",
            responseValueRenderOption: "FORMATTED_VALUE",
            valueInputOption: "USER_ENTERED"
        };

        return $.ajax({
            url: buildUpdateUrl(range, options || defaultOptions),
            type: 'put',
            data: JSON.stringify(data),
            dataType: 'json',
            beforeSend: function(request) {
                buildHeader(request);
          }
        })
    }

    function buildHeader(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + globalOptions.accessToken);
        request.setRequestHeader('Content-Type','application/json');
    }

    function buildBaseUrl() {
        return globalOptions.apiUrl + "/" + globalOptions.sheetId
    }

    function buildUpdateUrl(range, options) {
        return buildBaseUrl() + "/values/" + range + "?" + concatParams(options);

    }

    function concatParams(options) {
        return Object.entries(defaultOptions).map(([key, value]) => key+"="+value).join("&");
    }

    // Export module
    return {
        update: update
    };
};
