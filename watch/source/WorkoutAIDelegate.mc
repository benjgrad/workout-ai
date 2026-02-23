import Toybox.Lang;
import Toybox.WatchUi;

class WorkoutAIDelegate extends WatchUi.BehaviorDelegate {
    private var _view as WorkoutAIView or Null;

    function initialize() {
        BehaviorDelegate.initialize();
        _view = null;
    }

    function setView(view as WorkoutAIView) as Void {
        _view = view;
    }

    function onSelect() as Boolean {
        if (_view != null) {
            (_view as WorkoutAIView).setMessage("Syncing...");
        }

        var sync = new PlanSync(method(:onSyncComplete));
        sync.fetchPlan();
        return true;
    }

    function onSyncComplete(success as Boolean, message as String) as Void {
        if (success) {
            WatchUi.switchToView(
                new PlanListView(),
                new PlanListDelegate(),
                WatchUi.SLIDE_LEFT
            );
        } else {
            if (_view != null) {
                (_view as WorkoutAIView).setMessage(message);
            }
        }
    }
}
