import * as Flex from '@twilio/flex-ui';
import ConferenceService from '../../service/ConferenceService';
import { ErrorManager, FlexPluginErrorType } from '../../utils/ErrorManager';

export interface EventPayload {
  participantType: string;
  task: Flex.ITask;
  targetSid: string;
}

export function handleHoldConferenceParticipant(flex: typeof Flex, manager: Flex.Manager) {
  try {
    flex.Actions.addListener('beforeHoldParticipant', async (payload: EventPayload, abortFunction: () => void) => {
      const { participantType, targetSid: participantSid, task } = payload;

      if (participantType !== 'unknown') {
        return;
      }

      const conferenceSid = task.conference?.conferenceSid;
      abortFunction();
      console.log('Holding participant', participantSid);
      if (conferenceSid) await ConferenceService.holdParticipant(conferenceSid, participantSid);
    });
  } catch (e) {
    throw ErrorManager.createAndProcessError("Could not add 'beforeHoldParticipant' listener", {
      type: FlexPluginErrorType.action,
      description: e instanceof Error ? `${e.message}` : "Could not add 'beforeHoldParticipant' listener",
      context: 'Plugin.Action.beforeHoldParticipant',
      wrappedError: e,
    });
  }
}
