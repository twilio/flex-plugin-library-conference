import { ProgrammableVoiceUtils } from '@twilio/flex-plugins-library-utils';

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.callSid the unique call SID to fetch
 * @returns {Map} The given call's properties
 * @description fetches the given call SID's properties
 */
exports.fetchProperties = async (parameters) => {
  const { context, callSid } = parameters;

  const config = {
    attempts: 3,
    callSid,
  };

  const client = context.getTwilioClient();
  const voiceClient = new ProgrammableVoiceUtils(client, config);
  try {
    const call = await voiceClient.fetchProperties(config);
    return { success: true, callProperties: call.callProperties, status: 200 };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};
