import helpers from '../../test-utils/test-helper';

jest.mock('../../../functions/helpers/prepare-function.private.js', () => ({
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
    global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
    global.Runtime._addFunction('helpers/parameter-validator', './functions/helpers/parameter-validator.private.js');
    global.Runtime._addFunction(
      'twilio-wrappers/conference-participant',
      './functions/twilio-wrappers/conference-participant.private.js',
    );
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  it('removeParticipant is called successfully ', async () => {
    const RemoveParticipant = require('../../../functions/conference/remove-participant');
    const handlerFn = RemoveParticipant.handler;
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => getRemoveParticipantMockTwilioClient(removeParticipantMock),
    };
    const mockEvent = {
      conference: 'mockTaskSid',
      participant: 'mockParticipantSid',
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

  it('removeParticipant thorws error', async () => {
    const RemoveParticipant = require('../../../functions/conference/remove-participant');
    const handlerFn = RemoveParticipant.handler;

    const mockEvent = {
      conference: 'mockTaskSid',
      participant: 'mockParticipantSid',
    };

    const mockResponse = new Twilio.Response();
    const mockErrorObject = jest.fn();

    const mockCallbackObject = jest.fn();
    await handlerFn({}, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
    expect(mockErrorObject.mock.calls.length).toBe(1);
  });
});
