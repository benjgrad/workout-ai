import Toybox.Application;
import Toybox.WatchUi;

class WorkoutAIApp extends Application.AppBase {
    function initialize() {
        AppBase.initialize();
    }

    function onStart(state) {
    }

    function onStop(state) {
    }

    function getInitialView() {
        if (PlanStorage.hasPlan()) {
            return [new PlanListView(), new PlanListDelegate()];
        }
        var view = new WorkoutAIView();
        var delegate = new WorkoutAIDelegate();
        delegate.setView(view);
        return [view, delegate];
    }
}
