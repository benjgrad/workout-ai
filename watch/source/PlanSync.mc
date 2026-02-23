import Toybox.Communications;
import Toybox.Lang;
import Toybox.System;
import Toybox.WatchUi;

class PlanSync {
    // TODO: Update this URL to your ngrok HTTPS URL before sideloading
    private static const BASE_URL = "https://YOUR-NGROK-URL.ngrok-free.app";
    private static const USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    private static const API_KEY = "dev-watch-key-change-in-production";

    private var _callback as Method;

    function initialize(callback as Method) {
        _callback = callback;
    }

    function fetchPlan() as Void {
        var url = BASE_URL + "/v1/watch/plan/" + USER_ID + "?key=" + API_KEY;
        var options = {
            :method => Communications.HTTP_REQUEST_METHOD_GET,
            :responseType => Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON,
            :headers => {
                "Accept" => "application/json"
            }
        };

        Communications.makeWebRequest(url, null, options, method(:onResponse));
    }

    function onResponse(responseCode as Number, data as Dictionary or Null) as Void {
        if (responseCode == 200 && data != null) {
            PlanStorage.savePlan(data);
            _callback.invoke(true, "Plan loaded");
        } else {
            var msg = "Error: " + responseCode;
            _callback.invoke(false, msg);
        }
    }
}
