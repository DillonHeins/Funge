package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.UpdatePlantRequest;
import cf.funge.aworldofplants.model.plant.Plant;
import cf.funge.aworldofplants.model.plant.PlantDAO;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

/**
 * Action that extracts a plant from the data store based on the given plantId
 * <p/>
 * GET to /plants/{plantId}
 */
public class UpdatePlantAction extends AbstractAction {
    private static LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        UpdatePlantRequest input = getGson().fromJson(request, UpdatePlantRequest.class);

        if (input == null ||
                input.getPlantId() == null ||
                input.getPlantId().trim().equals("")) {
            logger.log("Invalid input passed to " + this.getClass().getName());
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        PlantDAO dao = DAOFactory.getPlantDAO();
        Plant updatedPlant = new Plant();
        updatedPlant.setPlantId(input.getPlantId());
        updatedPlant.setUsername(input.getUsername());
        updatedPlant.setPlantType(input.getPlantType());
        updatedPlant.setPlantName(input.getPlantName());
        updatedPlant.setPlantAge(input.getPlantAge());

        dao.updatePlant(updatedPlant);

        return "Updated plant successfully";
    }
}