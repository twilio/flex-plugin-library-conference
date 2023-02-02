import { setup } from '../../test-utils/test-helper.js';

const mockTo = '+91xxxxxxxxxx';
const mockFrom = '+91xxxxxxxxxx';
const taskSid = 'TSxxxxxxxx';
const mockCallSid = 'CSxxxxxxxx';
const participantSid = 'PSxxxxxxxx';

describe('addParticipant tests from ConferenceParticipant', () => {
  beforeAll(() => {
    setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  const createParticipant = jest.fn(() =>
    Promise.resolve({
      callSid: mockCallSid,
    }),
  );

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

  it('addParticipant returns success response', async () => {
    const { addParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      taskSid,
      to: mockTo,
      from: mockFrom,
    };
    const context = {
      getTwilioClient: () => getAddParticipantMockTwilioClient(createParticipant),
    };

    const participant = await addParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      callSid: mockCallSid,
      status: 200,
    });
    expect(createParticipant.mock.calls.length).toBe(1);
    expect(createParticipant.mock.calls[0][0]).toStrictEqual({
      to: mockTo,
      from: mockFrom,
      earlyMedia: true,
      endConferenceOnExit: false,
    });
  });

  it('addParticipant throws invalid parameters object passed', async () => {
    const { addParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      taskSid,
      to: mockTo,
      from: mockFrom,
    };

    let err = null;
    try {
      await addParticipant({ ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain reason context object');
  });

  it('addParticipant throws invalid parameters object passed', async () => {
    const { addParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      taskSid: 1,
      to: mockTo,
      from: mockFrom,
    };
    const context = {
      getTwilioClient: () => getAddParticipantMockTwilioClient(createParticipant),
    };

    let err = null;
    try {
      await addParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain taskSid string');
  });

  it('addParticipant throws invalid parameters object passed', async () => {
    const { addParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      taskSid,
      to: 123,
      from: mockFrom,
    };

    const context = {
      getTwilioClient: () => getAddParticipantMockTwilioClient(createParticipant),
    };

    let err = null;
    try {
      await addParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain to string');
  });

  it('addParticipant throws invalid parameters object passed', async () => {
    const { addParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      taskSid,
      to: mockTo,
      from: 123,
    };
    const context = {
      getTwilioClient: () => getAddParticipantMockTwilioClient(createParticipant),
    };

    let err = null;
    try {
      await addParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain from string');
  });
});

describe('holdParticipant tests from ConferenceParticipant', () => {
  beforeAll(() => {
    setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  const holdUpdateParticipant = jest.fn(() =>
    Promise.resolve({
      callSid: mockCallSid,
    }),
  );

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

  it('holdParticipant returns success response', async () => {
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      hold: true,
    };

    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    const participant = await holdParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      callSid: mockCallSid,
      status: 200,
    });
    expect(holdUpdateParticipant.mock.calls.length).toBe(1);
    expect(holdUpdateParticipant.mock.calls[0][0]).toStrictEqual({
      hold: true,
    });
  });

  it('holdParticipant throws invalid parameters object passed', async () => {
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      hold: true,
    };

    let err = null;
    try {
      await holdParticipant({ ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain reason context object');
  });

  it('holdParticipant throws invalid parameters object passed', async () => {
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: 1,
      participant: participantSid,
      hold: true,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await holdParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain conference string');
  });

  it('holdParticipant throws invalid parameters object passed', async () => {
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: 1,
      hold: true,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await holdParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain participant string');
  });

  it('holdParticipant throws invalid parameters object passed', async () => {
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      hold: 1,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await holdParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain hold boolean');
  });
});

describe('updateParticipant tests from ConferenceParticipant', () => {
  beforeAll(() => {
    setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  const holdUpdateParticipant = jest.fn(() =>
    Promise.resolve({
      callSid: mockCallSid,
    }),
  );

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

  it('updateParticipant returns success response', async () => {
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      endConferenceOnExit: true,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    const participant = await updateParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      callSid: mockCallSid,
      status: 200,
    });
    expect(holdUpdateParticipant.mock.calls.length).toBe(1);
    expect(holdUpdateParticipant.mock.calls[0][0]).toStrictEqual({
      endConferenceOnExit: true,
    });
  });

  it('updateParticipant throws invalid parameters object passed', async () => {
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      endConferenceOnExit: true,
    };

    let err = null;
    try {
      await updateParticipant({ ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain reason context object');
  });

  it('updateParticipant throws invalid parameters object passed', async () => {
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: 1,
      participant: participantSid,
      endConferenceOnExit: true,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await updateParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain conference string');
  });

  it('updateParticipant throws invalid parameters object passed', async () => {
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: 1,
      endConferenceOnExit: true,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await updateParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain participant string');
  });

  it('updateParticipant throws invalid parameters object passed', async () => {
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      endConferenceOnExit: 1,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await updateParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain endConferenceOnExit boolean');
  });
});

describe('removeParticipant tests from ConferenceParticipant', () => {
  beforeAll(() => {
    setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });
  const removeParticipantMock = jest.fn(() => Promise.resolve());
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

  it('removeParticipant returns success response', async () => {
    const { removeParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
    };
    const context = {
      getTwilioClient: () => getRemoveParticipantMockTwilioClient(removeParticipantMock),
    };

    const participant = await removeParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      status: 200,
    });
    expect(removeParticipantMock.mock.calls.length).toBe(1);
  });

  it('removeParticipant throws invalid parameters object passed', async () => {
    const { removeParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
    };

    let err = null;
    try {
      await removeParticipant({ ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain reason context object');
  });

  it('removeParticipant throws invalid parameters object passed', async () => {
    const { removeParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: 1,
      participant: participantSid,
    };
    const context = {
      getTwilioClient: () => getRemoveParticipantMockTwilioClient(removeParticipantMock),
    };

    let err = null;
    try {
      await removeParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain conference string');
  });

  it('removeParticipant throws invalid parameters object passed', async () => {
    const { removeParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: 1,
    };
    const context = {
      getTwilioClient: () => getRemoveParticipantMockTwilioClient(removeParticipantMock),
    };

    let err = null;
    try {
      await removeParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain participant string');
  });
});
