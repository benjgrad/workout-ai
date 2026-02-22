import Toybox.Graphics;
import Toybox.WatchUi;

class WorkoutAIView extends WatchUi.View {
    function initialize() {
        View.initialize();
    }

    function onLayout(dc as Dc) as Void {
    }

    function onUpdate(dc as Dc) as Void {
        dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
        dc.clear();

        var centerX = dc.getWidth() / 2;
        var centerY = dc.getHeight() / 2;

        dc.drawText(centerX, centerY - 20, Graphics.FONT_MEDIUM,
            "Workout AI", Graphics.TEXT_JUSTIFY_CENTER);
        dc.drawText(centerX, centerY + 20, Graphics.FONT_SMALL,
            "Ready", Graphics.TEXT_JUSTIFY_CENTER);
    }
}
