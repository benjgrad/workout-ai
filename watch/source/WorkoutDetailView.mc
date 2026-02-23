import Toybox.Graphics;
import Toybox.Lang;
import Toybox.WatchUi;

class WorkoutDetailView extends WatchUi.View {
    private var _workout as Dictionary;

    function initialize(workout as Dictionary) {
        View.initialize();
        _workout = workout;
    }

    function onUpdate(dc as Dc) as Void {
        dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
        dc.clear();

        var centerX = dc.getWidth() / 2;
        var y = 30;
        var lineHeight = 25;

        // Title
        var title = _workout.get("title") as String;
        dc.setColor(Graphics.COLOR_BLUE, Graphics.COLOR_TRANSPARENT);
        dc.drawText(centerX, y, Graphics.FONT_SMALL, title, Graphics.TEXT_JUSTIFY_CENTER);
        y += lineHeight + 5;

        // Date
        var date = _workout.get("scheduledFor") as String;
        dc.setColor(Graphics.COLOR_LT_GRAY, Graphics.COLOR_TRANSPARENT);
        dc.drawText(centerX, y, Graphics.FONT_XTINY, date, Graphics.TEXT_JUSTIFY_CENTER);
        y += lineHeight;

        // Steps
        var steps = _workout.get("steps") as Array;
        if (steps == null || steps.size() == 0) {
            dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_TRANSPARENT);
            dc.drawText(centerX, y, Graphics.FONT_XTINY, "No steps", Graphics.TEXT_JUSTIFY_CENTER);
            return;
        }

        dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_TRANSPARENT);
        for (var i = 0; i < steps.size(); i++) {
            if (y > dc.getHeight() - 20) {
                dc.drawText(centerX, y, Graphics.FONT_XTINY, "...", Graphics.TEXT_JUSTIFY_CENTER);
                break;
            }

            var step = steps[i] as Dictionary;
            var type = step.get("type") as String;
            var durationSec = step.get("durationSec");
            var label = type;

            if (durationSec != null && durationSec instanceof Number) {
                var mins = (durationSec as Number) / 60;
                var secs = (durationSec as Number) % 60;
                if (secs == 0) {
                    label = type + " " + mins + ":00";
                } else {
                    label = type + " " + mins + ":" + secs.format("%02d");
                }
            }

            dc.drawText(centerX, y, Graphics.FONT_XTINY, label, Graphics.TEXT_JUSTIFY_CENTER);
            y += lineHeight - 5;
        }
    }
}

class WorkoutDetailDelegate extends WatchUi.BehaviorDelegate {
    function initialize() {
        BehaviorDelegate.initialize();
    }

    function onBack() as Boolean {
        WatchUi.popView(WatchUi.SLIDE_RIGHT);
        return true;
    }
}
