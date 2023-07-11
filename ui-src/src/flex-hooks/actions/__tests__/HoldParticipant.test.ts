import * as Flex from '@twilio/flex-ui';
import { handleHoldConferenceParticipant } from '../HoldParticipant';
import ConferenceService from '../../../service/ConferenceService';

jest.mock('../../../service/ConferenceService', () => {
  return {
    holdParticipant: jest.fn(),
  };
});

describe('HoldParticipant Action', () => {
  const flex: typeof Flex = Flex;
  const manager: Flex.Manager = Flex.Manager.getInstance();
  const actionSpy = jest.spyOn(ConferenceService, 'holdParticipant');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('adds beforeHoldParticipant listener', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleHoldConferenceParticipant(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('should call ConferenceService.holdParticipant with correct parameters', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleHoldConferenceParticipant(flex, manager);
    const mockPayload = {
      participantType: 'unknown',
      task: { conference: { conferenceSid: 'mockSid' } },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('HoldParticipant', mockPayload);
    expect(actionSpy).toHaveBeenCalled();
    expect(actionSpy).toBeCalledWith('mockSid', 'mockPartSid');
    actionSpy.mockRestore();
  });

  it('should not call ConferenceService.holdParticipant with incorrect participantType', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleHoldConferenceParticipant(flex, manager);
    const mockPayload = {
      participantType: 'agent',
      task: { conference: { conferenceSid: 'mockSid' } },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('HoldParticipant', mockPayload);
    expect(actionSpy).not.toBeCalledWith('mockSid', 'mockPartSid');
    actionSpy.mockRestore();
  });
});
