const callSid = 'CSxxxxxxx';
jest.mock('@twilio/flex-plugins-library-utils', () => ({
  __esModule: true,
  ProgrammableVoiceUtils: jest.fn(),
}));

import { ProgrammableVoiceUtils } from '@twilio/flex-plugins-library-utils';

describe('fetchProperties tests from PrpgrammableVoice', () => {
  it('fetchProperties returns success response', async () => {
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
    const { fetchProperties } = require('../../../functions/twilio-wrappers/programmable-voice.private');
    const parameters = {
      callSid,
    };
    const context = {
      getTwilioClient: () => () => jest.fn(),
    };

    const participant = await fetchProperties({ context, ...parameters });

    expect(participant.success).toEqual(true);
  });

  it('fetchProperties returns error response', async () => {
    ProgrammableVoiceUtils.mockImplementation((value) => {
      return {
        fetchProperties: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          })
        ),
      };
    });
    const { fetchProperties } = require('../../../functions/twilio-wrappers/programmable-voice.private');
    const parameters = {
      callSid,
    };

    const context = {
      getTwilioClient: () => () => jest.fn(),
    };

    const errParticipant = await fetchProperties({ context, ...parameters });

    expect(errParticipant).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});
