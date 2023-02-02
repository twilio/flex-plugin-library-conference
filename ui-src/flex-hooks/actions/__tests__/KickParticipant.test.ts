import * as Flex from '@twilio/flex-ui';
import { handleKickConferenceParticipant } from '../KickParticipant';
import ConferenceService from '../../../service/ConferenceService';

jest.mock('../../../service/ConferenceService', () => {
  return {
    removeParticipant: jest.fn(),
  };
});

describe('KickParticipant Action', () => {
  let flex: typeof Flex = Flex;
  let manager: Flex.Manager = Flex.Manager.getInstance();
  const actionSpy = jest.spyOn(ConferenceService, 'removeParticipant');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('adds beforeKickParticipant listener', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleKickConferenceParticipant(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('should call ConferenceService.removeParticipant with correct parameters', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleKickConferenceParticipant(flex, manager);
    const mockPayload = {
      participantType: 'unknown',
      task: { conference: { conferenceSid: 'mockSid' } },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('KickParticipant', mockPayload);
    expect(actionSpy).toHaveBeenCalled();
    expect(actionSpy).toBeCalledWith('mockSid', 'mockPartSid');
    actionSpy.mockRestore();
  });

  it('should not call ConferenceService.removeParticipant with incorrect participantType', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleKickConferenceParticipant(flex, manager);
    const mockPayload = {
      participantType: 'worker',
      task: { conference: { conferenceSid: 'mockSid' } },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('KickParticipant', mockPayload);
    expect(actionSpy).not.toBeCalledWith('mockSid', 'mockPartSid');
    actionSpy.mockRestore();
  });
});
