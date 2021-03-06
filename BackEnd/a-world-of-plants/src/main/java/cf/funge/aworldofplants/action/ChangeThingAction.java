package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.ChangeThingRequest;
import cf.funge.aworldofplants.model.action.ChangeThingResponse;
import cf.funge.aworldofplants.model.thing.Thing;
import cf.funge.aworldofplants.model.thing.ThingDAO;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.iotdata.AWSIotDataClient;
import com.amazonaws.services.iotdata.model.UpdateThingShadowRequest;
import com.amazonaws.services.iotdata.model.UpdateThingShadowResult;
import com.amazonaws.services.lambda.AWSLambdaClient;
import com.amazonaws.services.lambda.model.InvokeRequest;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;

import java.nio.ByteBuffer;
import java.nio.charset.Charset;

/**
 * Action that updates a thing with the specified thing name
 * <p/>
 * POST to /things/update
 */
public class ChangeThingAction extends AbstractAction {
    private static LambdaLogger logger;

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        ChangeThingRequest input = getGson().fromJson(request, ChangeThingRequest.class);

        if (input == null ||
                input.getThingName() == null ||
                input.getThingName().trim().equals("")) {
            logger.log("Invalid input passed to " + this.getClass().getName());
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        ThingDAO dao = DAOFactory.getThingDAO();
        Thing existingThing;
        try {
            existingThing = dao.getThingByName(input.getThingName());
        } catch (DAOException e) {
            existingThing = new Thing();
        }
        Thing updatedThing = new Thing();
        updatedThing.setThingName(input.getThingName());
        updatedThing.setThingId(existingThing.getThingId());
        updatedThing.setUsername(existingThing.getUsername());
        updatedThing.setCertificateId(existingThing.getCertificateId());
        updatedThing.setCertificateArn(existingThing.getCertificateArn());
        updatedThing.setMqttTopic(existingThing.getMqttTopic());
        updatedThing.setPolicyName(existingThing.getPolicyName());
        updatedThing.setFiles(existingThing.getFiles());
        updatedThing.setColour(input.getColour());
        updatedThing.setPlantId(input.getPlantId());

        dao.updateThing(updatedThing);
        ChangeThingResponse output = new ChangeThingResponse();
        output.setThingId(existingThing.getThingId());
;


        AWSIotDataClient iotdata = new AWSIotDataClient();
        iotdata.setEndpoint("a3afwj65bsju7b.iot.us-east-1.amazonaws.com");

        // Update Thing Shadow with plantId

        AWSLambdaClient lambda = new AWSLambdaClient();

        lambda.configureRegion(Regions.US_EAST_1);
        String payload = "{\"thingName\": \"" + input.getThingName() + "\", \"shadow\": {\"state\": {\"desired\": {\"plantId\":  \"" + input.getPlantId() + "\"}}}}";

        InvokeRequest invokeRequest = new InvokeRequest();
        invokeRequest.setFunctionName("updateThingShadow");
        invokeRequest.setPayload(payload);

        System.out.println("Updating thing shadow: " + byteBufferToString(
                lambda.invoke(invokeRequest).getPayload(), Charset.forName("UTF-8")
        ));

        return getGson().toJson(output);
    }

    public static String byteBufferToString(ByteBuffer buffer, Charset charset) {
        byte[] bytes;
        if (buffer.hasArray()) {
            bytes = buffer.array();
        } else {
            bytes = new byte[buffer.remaining()];
            buffer.get(bytes);
        }
        return new String(bytes, charset);
    }
}
