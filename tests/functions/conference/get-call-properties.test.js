import helpers from '../../test-utils/test-helper';

jest.mock('../../../functions/helpers/prepare-function.private.js', () => ({
  __esModule: true,
  prepareFlexFunction: (_, fn) => fn,
}));

describe('Get Call Properties', () => {
  const getVoiceMockTwilioClient = function (fetchProperties) {
    const mockVoiceService = {
      fetch: fetchProperties,
    };
    return {
      calls: (_callSid) => mockVoiceService,
    };
  };

  const fetchProperties = jest.fn(() => Promise.resolve());

  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
    global.Runtime._addFunction('helpers/parameter-validator', './functions/helpers/parameter-validator.private.js');
    global.Runtime._addFunction(
      'twilio-wrappers/programmable-voice',
      './functions/twilio-wrappers/programmable-voice.private.js',
    );
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  it('GetCallProperties is called successfully ', async () => {
    const GetCallProperties = require('../../../functions/conference/get-call-properties');
    const handlerFn = GetCallProperties.handler;
    const requiredParameters = [
      { key: 'taskSid', purpose: 'unique ID of task to update' },
      { key: 'to', purpose: 'number to add to the conference' },
      { key: 'from', purpose: 'caller ID to use when adding to the conference' },
    ];
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => getVoiceMockTwilioClient(fetchProperties),
    };
    const mockEvent = {
      callSid: 'CSxxxxx',
    };

    const mockResponse = new Twilio.Response();
    const mockErrorObject = jest.fn(() => Promise.resolve());

    const mockCallbackObject = (_err, response) => {
      expect(response).toBeInstanceOf(Twilio.Response);
      expect(response._statusCode).toEqual(200);
      expect(response._body.success).toBe(true);
    };
    await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
  });
});
