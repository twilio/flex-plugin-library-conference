import * as Flex from '@twilio/flex-ui';
import ConferenceService from '../../service/ConferenceService';
import { ErrorManager, FlexPluginErrorType } from '../../utils/ErrorManager';

export function handleUnholdConferenceParticipant(flex: typeof Flex, manager: Flex.Manager) {
  try {
    flex.Actions.addListener('beforeUnholdParticipant', async (payload, abortFunction) => {
      const { participantType, targetSid: participantSid, task } = payload;

      if (participantType !== 'unknown') {
        return;
      }

      console.log('Unholding participant', participantSid);

      const conferenceSid = task.conference?.conferenceSid;
      abortFunction();
      await ConferenceService.unholdParticipant(conferenceSid, participantSid);
    });
  } catch (e) {
    throw ErrorManager.createAndProcessError("Could not add 'beforeUnholdParticipant' listener", {
      type: FlexPluginErrorType.action,
      description: e instanceof Error ? `${e.message}` : "Could not add 'beforeUnholdParticipant' listener",
      context: 'Plugin.Action.beforeUnholdParticipant',
      wrappedError: e,
    });
  }
}
