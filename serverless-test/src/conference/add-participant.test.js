import helpers from '../../test-utils/test-helper';

jest.mock('serverless/src/functions/helpers/prepare-function.private.js', () => ({
  __esModule: true,
  prepareFlexFunction: (_, fn) => fn,
}));

const mockCallSid = 'CSxxxxx';
describe('Add Participant', () => {
  const getAddParticipantMockTwilioClient = function (createParticipant) {
    const createConferenceService = (taskSid) => ({
      sid: taskSid,
    });

    const mockConferenceService = {
      conferences: {
        create: createConferenceService,
      },
      participants: {
        create: createParticipant,
      },
    };
    return {
      conferences: (_taskSid) => mockConferenceService,
    };
  };

  const createParticipant = jest.fn(() =>
    Promise.resolve({
      callSid: mockCallSid,
    }),
  );

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

  it('addParticipant is called successfully ', async () => {
    const AddParticipant = require('../../../serverless/src/functions/conference/add-participant');
    const handlerFn = AddParticipant.handler;
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => getAddParticipantMockTwilioClient(createParticipant),
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

  it('addParticipant error handler is called', async () => {
    const AddParticipant = require('../../../serverless/src/functions/conference/add-participant');
    const handlerFn = AddParticipant.handler;
    const mockEvent = {
      taskSid: 'TSxxxxx',
      to: '+91xxxxxx',
      from: '+1xxxxxx',
    };

    const mockResponse = new Twilio.Response();
    const mockCallbackObject = jest.fn();

    const mockErrorObject = jest.fn();
    await handlerFn({}, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
    expect(mockErrorObject.mock.calls.length).toBe(1);
  });
});
