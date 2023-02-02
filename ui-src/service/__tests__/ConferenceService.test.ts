import ConferenceService from '../ConferenceService';
// import { CallbackNotification } from "../../flex-hooks/notifications/Callback";
import * as Flex from '@twilio/flex-ui';
import { setServiceConfiguration } from '../../../test-utils/flex-service-configuration';
// import { Actions } from "../../flex-hooks/states/";
import fetch from 'jest-fetch-mock';

describe('setEndConferenceOnExit', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('ends the conference successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ callSid: 'CSxxxxxx' }));
    const response = await ConferenceService.setEndConferenceOnExit('CFxxxxxx', 'PSxxxxxx', true);
    expect(response).toBe('CSxxxxxx');
  });

  it('throws error when trying to end conference', async () => {
    fetch.mockRejectOnce('Mock Error string');
    let err = null;
    try {
      await ConferenceService.setEndConferenceOnExit('CFxxxxxx', 'PSxxxxxx', true);
    } catch (error) {
      err = error;
    }
    expect(err).toEqual('Mock Error string');
  });
});

describe('addParticipant', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('adds participant to the conference successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ callSid: 'CSxxxxxx' }));
    const response = await ConferenceService.addParticipant('TSxxxxxx', '+91xxxxxx', '+92xxxxxx');
    expect(response).toBe('CSxxxxxx');
  });

  it('throws error when trying to add a participant to the conference', async () => {
    fetch.mockRejectOnce('Mock Error string');
    let err = null;
    try {
      await ConferenceService.addParticipant('TSxxxxxx', '+91xxxxxx', '+92xxxxxx');
    } catch (error) {
      err = error;
    }
    expect(err).toEqual('Mock Error string');
  });
});

describe('holdParticipant', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('adds participant to the conference successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ callSid: 'CSxxxxxx' }));
    const response = await ConferenceService.holdParticipant('CFxxxxxx', 'PSxxxxxx');
    expect(response).toBe('CSxxxxxx');
  });

  it('throws error when trying to add a participant to the conference', async () => {
    fetch.mockRejectOnce('Mock Error string');
    let err = null;
    try {
      await ConferenceService.holdParticipant('CFxxxxxx', 'PSxxxxxx');
    } catch (error) {
      err = error;
    }
    expect(err).toEqual('Mock Error string');
  });
});

describe('unholdParticipant', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('adds participant to the conference successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ callSid: 'CSxxxxxx' }));
    const response = await ConferenceService.unholdParticipant('CFxxxxxx', 'PSxxxxxx');
    expect(response).toBe('CSxxxxxx');
  });

  it('throws error when trying to add a participant to the conference', async () => {
    fetch.mockRejectOnce('Mock Error string');
    let err = null;
    try {
      await ConferenceService.unholdParticipant('CFxxxxxx', 'PSxxxxxx');
    } catch (error) {
      err = error;
    }
    expect(err).toEqual('Mock Error string');
  });
});

describe('removeParticipant', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('adds participant to the conference successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ participantSid: 'PSxxxxxx' }));
    const response = await ConferenceService.removeParticipant('CFxxxxxx', 'PSxxxxxx');
    expect(response).toBe('PSxxxxxx');
  });

  it('throws error when trying to add a participant to the conference', async () => {
    fetch.mockRejectOnce('Mock Error string');
    let err = null;
    try {
      await ConferenceService.removeParticipant('CFxxxxxx', 'PSxxxxxx');
    } catch (error) {
      err = error;
    }
    expect(err).toEqual('Mock Error string');
  });
});

describe('getCallProperties', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('gives call properties successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ callProperties: { callSid: 'CSxxxxxx' } }));
    const response = await ConferenceService.getCallProperties('CFxxxxxx');
    expect(response).toEqual({ callSid: 'CSxxxxxx' });
  });

  it('throws error when trying to get properties', async () => {
    fetch.mockRejectOnce('Mock Error string');
    let err = null;
    try {
      await ConferenceService.getCallProperties('CFxxxxxx');
    } catch (error) {
      err = error;
    }
    expect(err).toEqual('Mock Error string');
  });
});
