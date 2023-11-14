import { ConferenceUtils } from '@twilio/flex-plugins-library-utils';

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the unique task SID to modify
 * @param {string} parameters.to the phone number to add to the conference
 * @param {string} parameters.from the caller ID to use when calling the to number
 * @returns {Participant} The newly created conference participant
 * @description adds the specified phone number as a conference participant
 */
exports.addParticipant = async (parameters) => {
  const { context, taskSid, to, from } = parameters;
  const config = {
    attempts: 3,
    taskSid,
    to,
    from,
  };

  const client = context.getTwilioClient();
  const conferenceClient = new ConferenceUtils(client, config);
  try {
    const participants = await conferenceClient.addParticipant(config);
    return { success: true, callSid: participants.participantsResponse.callSid, status: 200 };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to modify
 * @param {boolean} parameters.hold whether to hold or unhold the participant
 * @returns {Participant} The newly updated conference participant
 * @description holds or unholds the given conference participant
 */
exports.holdParticipant = async (parameters) => {
  const { context, conference, participant, hold } = parameters;

  const config = {
    attempts: 3,
    conferenceSid: conference,
    participantSid: participant,
    hold,
  };

  const client = context.getTwilioClient();
  const conferenceClient = new ConferenceUtils(client, config);
  try {
    const participants = await conferenceClient.holdParticipant(config);
    return { success: true, callSid: participants.participantsResponse.callSid, status: 200 };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to remove
 * @returns empty response object
 * @description removes the given conference participant
 */
exports.removeParticipant = async (parameters) => {
  const { context, conference, participant } = parameters;

  const config = {
    attempts: 3,
    conferenceSid: conference,
    participantSid: participant,
  };

  const client = context.getTwilioClient();
  const conferenceClient = new ConferenceUtils(client, config);
  try {
    const participants = await conferenceClient.removeParticipant(config);
    return { success: true, status: 200 };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to modify
 * @param {boolean} parameters.endConferenceOnExit whether to end conference when the participant leaves
 * @returns {Participant} The newly updated conference participant
 * @description sets endConferenceOnExit on the given conference participant
 */
exports.updateParticipant = async (parameters) => {
  const { context, conference, participant, endConferenceOnExit } = parameters;

  const config = {
    attempts: 3,
    conferenceSid: conference,
    participantSid: participant,
    endConferenceOnExit,
  };

  const client = context.getTwilioClient();
  const conferenceClient = new ConferenceUtils(client, config);
  try {
    const participants = await conferenceClient.updateParticipant(config);
    return { success: true, callSid: participants.participantsResponse.callSid, status: 200 };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};
