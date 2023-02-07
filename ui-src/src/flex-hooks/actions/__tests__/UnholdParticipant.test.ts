import * as Flex from '@twilio/flex-ui';
import { handleUnholdConferenceParticipant } from '../UnholdParticipant';
import ConferenceService from '../../../service/ConferenceService';

jest.mock('../../../service/ConferenceService', () => {
  return {
    unholdParticipant: jest.fn(),
  };
});

describe('UnholdParticipant Action', () => {
  let flex: typeof Flex = Flex;
  let manager: Flex.Manager = Flex.Manager.getInstance();
  const actionSpy = jest.spyOn(ConferenceService, 'unholdParticipant');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('adds beforeUnholdParticipant listener', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleUnholdConferenceParticipant(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('should call ConferenceService.unholdParticipant with correct parameters', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleUnholdConferenceParticipant(flex, manager);
    const mockPayload = {
      participantType: 'unknown',
      task: { conference: { conferenceSid: 'mockSid' } },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('UnholdParticipant', mockPayload);
    expect(actionSpy).toHaveBeenCalled();
    expect(actionSpy).toBeCalledWith('mockSid', 'mockPartSid');
    actionSpy.mockRestore();
  });

  it('should not call ConferenceService.unholdParticipant with incorrect participantType', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleUnholdConferenceParticipant(flex, manager);
    const mockPayload = {
      participantType: 'agent',
      task: { conference: { conferenceSid: 'mockSid' } },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('UnholdParticipant', mockPayload);
    expect(actionSpy).not.toBeCalledWith('mockSid', 'mockPartSid');
    actionSpy.mockRestore();
  });
});
