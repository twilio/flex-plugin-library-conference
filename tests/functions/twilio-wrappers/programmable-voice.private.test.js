import helpers from '../../test-utils/test-helper';
const callSid = 'CSxxxxxxx';

describe('fetchProperties tests from PrpgrammableVoice', () => {
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
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
  const fetchPropertiesMock = jest.fn(() => Promise.resolve());
  it('fetchProperties returns success response', async () => {
    const { fetchProperties } = require('../../../functions/twilio-wrappers/programmable-voice.private');
    const parameters = {
      callSid,
    };
    const context = {
      getTwilioClient: () => getVoiceMockTwilioClient(fetchPropertiesMock),
    };

    const participant = await fetchProperties({ context, ...parameters });

    expect(participant.success).toEqual(true);
    expect(fetchPropertiesMock.mock.calls.length).toBe(1);
  });

  it('fetchProperties throws invalid parameters object passed', async () => {
    const { fetchProperties } = require('../../../functions/twilio-wrappers/programmable-voice.private');
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
    const { fetchProperties } = require('../../../functions/twilio-wrappers/programmable-voice.private');
    const parameters = {
      callSid: 1,
    };
    const context = {
      getTwilioClient: () => getVoiceMockTwilioClient(fetchPropertiesMock),
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
