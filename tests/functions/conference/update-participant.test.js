import helpers from '../../test-utils/test-helper';

jest.mock('../../../functions/helpers/prepare-function.private.js', () => ({
  __esModule: true,
  prepareFlexFunction: (_, fn) => fn,
}));

const mockCallSid = 'CSxxxxx';
describe('Update Participant', () => {
  const getHolUpdateParticipantMockTwilioClient = function (holdParticipant) {
    const mockConferenceService = {
      participants: (_partSid) => ({
        update: holdParticipant,
      }),
    };
    return {
      conferences: (_taskSid) => mockConferenceService,
    };
  };
  const holdUpdateParticipant = jest.fn(() =>
    Promise.resolve({
      callSid: mockCallSid,
    }),
  );

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

  it('updateParticipant is called successfully ', async () => {
    const UpdateParticipant = require('../../../functions/conference/update-participant');
    const handlerFn = UpdateParticipant.handler;
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };
    const mockEvent = {
      conference: 'mockTaskSid',
      participant: 'mockParticipantSid',
      endConferenceOnExit: true,
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

  it('updateParticipant thorws error', async () => {
    const UpdateParticipant = require('../../../functions/conference/update-participant');
    const handlerFn = UpdateParticipant.handler;

    const mockEvent = {
      conference: 'mockTaskSid',
      participant: 'mockParticipantSid',
      endConferenceOnExit: true,
    };

    const mockResponse = new Twilio.Response();
    const mockErrorObject = jest.fn();

    const mockCallbackObject = jest.fn();
    await handlerFn({}, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
    expect(mockErrorObject.mock.calls.length).toBe(1);
  });
});
