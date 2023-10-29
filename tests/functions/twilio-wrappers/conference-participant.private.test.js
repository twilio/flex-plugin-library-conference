const mockTo = '+91xxxxxxxxxx';
const mockFrom = '+91xxxxxxxxxx';
const taskSid = 'TSxxxxxxxx';
const mockCallSid = 'CSxxxxxxxx';
const participantSid = 'PSxxxxxxxx';

jest.mock('@twilio/flex-plugins-library-utils', () => ({
  __esModule: true,
  ConferenceUtils: jest.fn(),
}));

import { ConferenceUtils } from '@twilio/flex-plugins-library-utils';

describe('addParticipant tests from ConferenceParticipant', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('addParticipant returns success response', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        addParticipant: jest.fn(() =>
          Promise.resolve({
            status: 200,
            participantsResponse: {
              callSid: mockCallSid,
            },
            success: true,
          }),
        ),
      };
    });
    const { addParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      taskSid,
      to: mockTo,
      from: mockFrom,
    };
    const context = {
      getTwilioClient: () => () => jest.fn(),
    };

    const participant = await addParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      callSid: mockCallSid,
      status: 200,
    });
  });

  it('addParticipant returns error response', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        addParticipant: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { addParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      taskSid,
      to: mockTo,
      from: mockFrom,
    };
    const context = {
      getTwilioClient: () => () => jest.fn(),
    };

    const errParticipant = await addParticipant({ context, ...parameters });

    expect(errParticipant).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});

describe('holdParticipant tests from ConferenceParticipant', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('holdParticipant returns success response', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        holdParticipant: jest.fn(() =>
          Promise.resolve({
            status: 200,
            participantsResponse: {
              callSid: mockCallSid,
            },
            success: true,
          }),
        ),
      };
    });
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      hold: true,
    };

    const context = {
      getTwilioClient: () => () => jest.fn(),
    };

    const participant = await holdParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      callSid: mockCallSid,
      status: 200,
    });
  });

  it('holdParticipant returns error response', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        holdParticipant: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      hold: true,
    };
    const context = {
      getTwilioClient: () => () => jest.fn(),
    };
    const errParticipant = await holdParticipant({ context, ...parameters });

    expect(errParticipant).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});

describe('updateParticipant tests from ConferenceParticipant', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updateParticipant returns success response', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        updateParticipant: jest.fn(() =>
          Promise.resolve({
            status: 200,
            participantsResponse: {
              callSid: mockCallSid,
            },
            success: true,
          }),
        ),
      };
    });
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      endConferenceOnExit: true,
    };
    const context = {
      getTwilioClient: () => () => jest.fn(),
    };

    const participant = await updateParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      callSid: mockCallSid,
      status: 200,
    });
  });

  it('updateParticipant return error response', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        updateParticipant: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      endConferenceOnExit: true,
    };

    const context = {
      getTwilioClient: () => () => jest.fn(),
    };
    const errParticipant = await updateParticipant({ context, ...parameters });

    expect(errParticipant).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});

describe('removeParticipant tests from ConferenceParticipant', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('removeParticipant returns success response', async () => {
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
    const { removeParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
    };
    const context = {
      getTwilioClient: () => () => jest.fn,
    };

    const participant = await removeParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      status: 200,
    });
  });

  it('removeParticipant returns error response', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        removeParticipant: jest.fn(() =>
          Promise.reject({
            success: true,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { removeParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
    };

    const context = {
      getTwilioClient: () => () => jest.fn(),
    };
    const errParticipant = await removeParticipant({ context, ...parameters });

    expect(errParticipant).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});
