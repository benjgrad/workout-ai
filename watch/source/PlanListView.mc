import Toybox.Graphics;
import Toybox.Lang;
import Toybox.WatchUi;

class PlanListView extends WatchUi.Menu2 {
    function initialize() {
        Menu2.initialize({:title => "Workouts"});
        loadWorkouts();
    }

    function loadWorkouts() as Void {
        var plan = PlanStorage.loadPlan();
        if (plan == null) {
            return;
        }

        var workouts = plan.get("workouts") as Array;
        if (workouts == null) {
            return;
        }

        for (var i = 0; i < workouts.size(); i++) {
            var workout = workouts[i] as Dictionary;
            var title = workout.get("title") as String;
            var date = workout.get("scheduledFor") as String;
            addItem(new WatchUi.MenuItem(title, date, i, {}));
        }
    }
}

class PlanListDelegate extends WatchUi.Menu2InputDelegate {
    function initialize() {
        Menu2InputDelegate.initialize();
    }

    function onSelect(item as WatchUi.MenuItem) as Void {
        var index = item.getId() as Number;
        var plan = PlanStorage.loadPlan();
        if (plan == null) {
            return;
        }

        var workouts = plan.get("workouts") as Array;
        if (workouts == null || index >= workouts.size()) {
            return;
        }

        var workout = workouts[index] as Dictionary;
        WatchUi.pushView(
            new WorkoutDetailView(workout),
            new WorkoutDetailDelegate(),
            WatchUi.SLIDE_LEFT
        );
    }
}
