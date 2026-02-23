import Toybox.Graphics;
import Toybox.Lang;
import Toybox.WatchUi;

class WorkoutAIView extends WatchUi.View {
    private var _message as String;

    function initialize() {
        View.initialize();
        _message = "Press Start\nto Sync";
    }

    function setMessage(msg as String) as Void {
        _message = msg;
        WatchUi.requestUpdate();
    }

    function onUpdate(dc as Dc) as Void {
        dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
        dc.clear();

        var centerX = dc.getWidth() / 2;
        var centerY = dc.getHeight() / 2;

        dc.drawText(centerX, centerY - 30, Graphics.FONT_MEDIUM,
            "Workout AI", Graphics.TEXT_JUSTIFY_CENTER);
        dc.drawText(centerX, centerY + 10, Graphics.FONT_SMALL,
            _message, Graphics.TEXT_JUSTIFY_CENTER);
    }
}
