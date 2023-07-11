import * as Flex from '@twilio/flex-ui';
import { handleConferenceHangup } from '../HangupCall';
import ConferenceService from '../../../service/ConferenceService';

describe('HoldParticipant Action', () => {
  const flex: typeof Flex = Flex;
  const manager: Flex.Manager = Flex.Manager.getInstance();

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('adds beforeHangupCall listener', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleConferenceHangup(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('removes onHold participant', async () => {
    const mockPayload = {
      task: {
        conference: {
          liveWorkerCount: 1,
          participants: [
            {
              participantType: 'PTxxxxxx',
              workerSid: 'WSxxxxxx',
              callSid: 'CSxxxxxx',
              onHold: true,
              status: 'joined',
            },
            {
              participantType: 'PTxxxxxx1',
              workerSid: 'WSxxxxxx1',
              callSid: 'CSxxxxxx',
              onHold: false,
              status: 'joined',
            },
          ],
        },
        taskSid: 'TSxxxxxx',
      },
    };

    jest.spyOn(Flex.StateHelper, 'getTaskByTaskrouterTaskSid').mockReturnValue({
      conference: {
        liveWorkerCount: 1,
        participants: [
          {
            participantType: 'PTxxxxxx',
            workerSid: 'WSxxxxxx',
            callSid: 'CSxxxxxx',
            onHold: true,
            status: 'joined',
          },
        ],
      },
      taskSid: 'TSxxxxxx',
    });
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    const actionSpy = jest.spyOn(flex.Actions, 'invokeAction');
    await handleConferenceHangup(flex, manager);

    flex.Actions.invokeAction('HangupCall', mockPayload);
    expect(actionSpy).toHaveBeenCalledWith('UnholdParticipant', {
      participantType: 'PTxxxxxx',
      task: {
        conference: {
          liveWorkerCount: 1,
          participants: [
            {
              participantType: 'PTxxxxxx',
              workerSid: 'WSxxxxxx',
              callSid: 'CSxxxxxx',
              onHold: true,
              status: 'joined',
            },
            {
              participantType: 'PTxxxxxx1',
              workerSid: 'WSxxxxxx1',
              callSid: 'CSxxxxxx',
              onHold: false,
              status: 'joined',
            },
          ],
        },
        taskSid: 'TSxxxxxx',
      },
      targetSid: 'CSxxxxxx',
    });
  });
});
