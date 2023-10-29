import helpers from '../../test-utils/test-helper';

jest.mock('../../../functions/helpers/prepare-function.private.js', () => ({
  __esModule: true,
  prepareFlexFunction: (_, fn) => fn,
}));
jest.mock('@twilio/flex-plugins-library-utils', () => ({
  __esModule: true,
  ProgrammableVoiceUtils: jest.fn(),
}));

import { ProgrammableVoiceUtils } from '@twilio/flex-plugins-library-utils';

describe('Get Call Properties', () => {
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
    global.Runtime._addFunction(
      'twilio-wrappers/programmable-voice',
      './functions/twilio-wrappers/programmable-voice.private.js',
    );
  });

  it('GetCallProperties is called successfully ', async () => {
    ProgrammableVoiceUtils.mockImplementation((value) => {
      return {
        fetchProperties: jest.fn(() =>
          Promise.resolve({
            status: 200,
            callProperties: {},
            success: true,
          }),
        ),
      };
    });
    const GetCallProperties = require('../../../functions/conference/get-call-properties');
    const handlerFn = GetCallProperties.handler;
    const requiredParameters = [
      { key: 'taskSid', purpose: 'unique ID of task to update' },
      { key: 'to', purpose: 'number to add to the conference' },
      { key: 'from', purpose: 'caller ID to use when adding to the conference' },
    ];
    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
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
