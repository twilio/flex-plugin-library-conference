import helpers from '../../test-utils/test-helper';
import ProgrammableVoice from '../../../serverless/src/functions/twilio-wrappers/programmable-voice.private';

const callSid = 'CSxxxxxxx';

afterAll(() => {
  helpers.teardown();
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

test('fetchProperties returns success response', async () => {
  const parameters = {
    callSid,
  };
  const context = {
    getTwilioClient: () => getVoiceMockTwilioClient(fetchProperties),
  };

  const participant = await ProgrammableVoice.fetchProperties({ context, ...parameters });

  expect(participant.success).toEqual(true);
  expect(fetchProperties.mock.calls.length).toBe(1);
});

test('fetchProperties throws invalid parameters object passed', async () => {
  const parameters = {
    callSid,
  };

  let err = null;
  try {
    await ProgrammableVoice.fetchProperties({ ...parameters });
  } catch (error) {
    err = error;
  }

  expect(err).toBe('Invalid parameters object passed. Parameters must contain reason context object');
});

test('fetchProperties throws invalid parameters object passed', async () => {
  const parameters = {
    callSid: 1,
  };
  const context = {
    getTwilioClient: () => getVoiceMockTwilioClient(fetchProperties),
  };

  let err = null;
  try {
    await ProgrammableVoice.fetchProperties({ context, ...parameters });
  } catch (error) {
    err = error;
  }

  expect(err).toBe('Invalid parameters object passed. Parameters must contain callSid string');
});
