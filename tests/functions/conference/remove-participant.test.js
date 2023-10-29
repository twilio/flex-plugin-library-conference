import helpers from '../../test-utils/test-helper';

jest.mock('../../../functions/helpers/prepare-function.private.js', () => ({
  __esModule: true,
  prepareFlexFunction: (_, fn) => fn,
}));
jest.mock('@twilio/flex-plugins-library-utils', () => ({
  __esModule: true,
  ConferenceUtils: jest.fn(),
}));

import { ConferenceUtils } from '@twilio/flex-plugins-library-utils';

const mockCallSid = 'CSxxxxx';
describe('Remove Participant', () => {
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
    global.Runtime._addFunction(
      'twilio-wrappers/conference-participant',
      './functions/twilio-wrappers/conference-participant.private.js',
    );
  });

  it('removeParticipant is called successfully ', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        removeParticipant: jest.fn(() =>
          Promise.resolve({
            success: true,
            status: 200,
          }),
        ),
      };
    });
    const RemoveParticipant = require('../../../functions/conference/remove-participant');
    const handlerFn = RemoveParticipant.handler;
    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
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
