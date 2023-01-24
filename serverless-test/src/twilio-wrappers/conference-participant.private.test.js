const helpers = require('../../test-utils/test-helper.js');
const {
  addParticipant,
  holdParticipant,
  removeParticipant,
  updateParticipant,
} = require('../../../serverless/src/functions/twilio-wrappers/conference-participant.private');

const mockTo = '+91xxxxxxxxxx';
const mockFrom = '+91xxxxxxxxxx';
const taskSid = 'TSxxxxxxxx';
const mockCallSid = 'CSxxxxxxxx';
const participantSid = 'PSxxxxxxxx';

afterAll(() => {
  helpers.teardown();
});

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

test('addParticipant returns success response', async () => {
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

// test('addParticipant returns retry response', async () => {
//   const parameters = {
//     taskSid,
//     to: mockTo,
//     from: mockFrom,
//     attempts: 0,
//   };
//   const context = {
//     getTwilioClient: () => {},
//   };

//   const participant = await addParticipant({ context, ...parameters });
//   expect(participant.status).toBe(500);
// });

test('addParticipant throws invalid parameters object passed', async () => {
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

test('addParticipant throws invalid parameters object passed', async () => {
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

test('addParticipant throws invalid parameters object passed', async () => {
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

test('addParticipant throws invalid parameters object passed', async () => {
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

test('holdParticipant returns success response', async () => {
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

test('holdParticipant throws invalid parameters object passed', async () => {
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

test('holdParticipant throws invalid parameters object passed', async () => {
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

test('holdParticipant throws invalid parameters object passed', async () => {
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

test('holdParticipant throws invalid parameters object passed', async () => {
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

test('updateParticipant returns success response', async () => {
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

test('updateParticipant throws invalid parameters object passed', async () => {
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

test('updateParticipant throws invalid parameters object passed', async () => {
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

test('updateParticipant throws invalid parameters object passed', async () => {
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

test('updateParticipant throws invalid parameters object passed', async () => {
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

test('removeParticipant returns success response', async () => {
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

test('removeParticipant throws invalid parameters object passed', async () => {
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

test('removeParticipant throws invalid parameters object passed', async () => {
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

test('removeParticipant throws invalid parameters object passed', async () => {
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
