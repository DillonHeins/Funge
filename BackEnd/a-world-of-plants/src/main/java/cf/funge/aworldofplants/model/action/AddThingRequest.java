package cf.funge.aworldofplants.model.action;

/**
 * Created by Dillon on 2016-09-01.
 */
public class AddThingRequest {
    private String thingName;
    private String plantId;

    public String getThingName() {
        return thingName;
    }

    public void setThingName(String thingName) {
        this.thingName = thingName;
    }

    public String getPlantId() {
        return plantId;
    }

    public void setPlantId(String plantId) {
        this.plantId = plantId;
    }
}