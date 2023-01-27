import helpers from '../../test-utils/test-helper';

jest.mock('serverless/src/functions/helpers/prepare-function.private.js', () => ({
  __esModule: true,
  prepareFlexFunction: (_, fn) => fn,
}));

const mockCallSid = 'CSxxxxx';
describe('Remove Participant', () => {
  const getRemoveParticipantMockTwilioClient = function (removeParticipant) {
    const mockConferenceService = {
      participants: (_partSid) => ({
        remove: removeParticipant,
      }),
    };
    return {
      conferences: (_taskSid) => mockConferenceService,
    };
  };
  const removeParticipantMock = jest.fn(() => Promise.resolve());

  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction(
      'helpers/prepare-function',
      './serverless/src/functions/helpers/prepare-function.private.js',
    );
    global.Runtime._addFunction(
      'helpers/parameter-validator',
      './serverless/src/functions/helpers/parameter-validator.private.js',
    );
    global.Runtime._addFunction(
      'twilio-wrappers/conference-participant',
      './serverless/src/functions/twilio-wrappers/conference-participant.private.js',
    );
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './serverless/src/functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  it('removeParticipant is called successfully ', async () => {
    const RemoveParticipant = require('../../../serverless/src/functions/conference/remove-participant');
    const handlerFn = RemoveParticipant.handler;
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => getRemoveParticipantMockTwilioClient(removeParticipantMock),
    };
    const mockEvent = {
      taskSid: 'TSxxxxx',
      to: '+91xxxxxx',
      from: '+1xxxxxx',
    };

    const mockResponse = new Twilio.Response();
    const mockErrorObject = jest.fn(() => Promise.resolve());

    const mockCallbackObject = (_err, response) => {
      expect(response).toBeInstanceOf(Twilio.Response);
      expect(response._statusCode).toEqual(200);
      expect(response._body.callSid).toBe(mockCallSid);
    };
    await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
  });
});
