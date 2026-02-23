import Toybox.Application;
import Toybox.Application.Storage;
import Toybox.Lang;

class PlanStorage {
    static function savePlan(planData as Dictionary) as Void {
        Storage.setValue("plan", planData);
        if (planData.hasKey("planVersion")) {
            Storage.setValue("planVersion", planData.get("planVersion"));
        }
    }

    static function loadPlan() as Dictionary or Null {
        return Storage.getValue("plan") as Dictionary or Null;
    }

    static function hasPlan() as Boolean {
        return Storage.getValue("planVersion") != null;
    }

    static function getPlanVersion() as Number {
        var version = Storage.getValue("planVersion");
        if (version != null) {
            return version as Number;
        }
        return 0;
    }

    static function clearPlan() as Void {
        Storage.deleteValue("plan");
        Storage.deleteValue("planVersion");
    }
}
