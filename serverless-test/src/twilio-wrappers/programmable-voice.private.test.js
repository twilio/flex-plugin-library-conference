import helpers from '../../test-utils/test-helper';
const callSid = 'CSxxxxxxx';

describe('addParticipant tests from ConferenceParticipant', () => {
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './serverless/src/functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  const getVoiceMockTwilioClient = function (fetchProperties) {
    const mockVoiceService = {
      fetch: fetchProperties,
    };
    return {
      calls: (_callSid) => mockVoiceService,
    };
  };
  const fetchProperties = jest.fn(() => Promise.resolve());
  it('fetchProperties returns success response', async () => {
    const { fetchProperties } = require('../../../serverless/src/functions/twilio-wrappers/programmable-voice.private');
    const parameters = {
      callSid,
    };
    const context = {
      getTwilioClient: () => getVoiceMockTwilioClient(fetchProperties),
    };

    const participant = await fetchProperties({ context, ...parameters });

    expect(participant.success).toEqual(true);
    expect(fetchProperties.mock.calls.length).toBe(1);
  });

  it('fetchProperties throws invalid parameters object passed', async () => {
    const { fetchProperties } = require('../../../serverless/src/functions/twilio-wrappers/programmable-voice.private');
    const parameters = {
      callSid,
    };

    let err = null;
    try {
      await fetchProperties({ ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain reason context object');
  });

  it('fetchProperties throws invalid parameters object passed', async () => {
    const { fetchProperties } = require('../../../serverless/src/functions/twilio-wrappers/programmable-voice.private');
    const parameters = {
      callSid: 1,
    };
    const context = {
      getTwilioClient: () => getVoiceMockTwilioClient(fetchProperties),
    };

    let err = null;
    try {
      await fetchProperties({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain callSid string');
  });
});
