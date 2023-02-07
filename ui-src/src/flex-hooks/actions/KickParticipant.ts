import * as Flex from '@twilio/flex-ui';
import ConferenceService from '../../service/ConferenceService';
import { ErrorManager, FlexPluginErrorType } from '../../utils/ErrorManager';

export function handleKickConferenceParticipant(flex: typeof Flex, manager: Flex.Manager) {
  try {
    flex.Actions.addListener('beforeKickParticipant', async (payload, abortFunction) => {
      const { participantType } = payload;

      if (
        participantType &&
        participantType !== 'transfer' &&
        participantType !== 'external' &&
        participantType !== 'worker'
      ) {
        abortFunction();

        const { task, targetSid } = payload;

        const conference = task.conference?.conferenceSid;

        const participantSid = targetSid;

        console.log(`Removing participant ${participantSid} from conference`);
        await ConferenceService.removeParticipant(conference, participantSid);
      }
    });
  } catch (e) {
    throw ErrorManager.createAndProcessError("Could not add 'beforeKickParticipant' listener", {
      type: FlexPluginErrorType.action,
      description: e instanceof Error ? `${e.message}` : "Could not add 'beforeKickParticipant' listener",
      context: 'Plugin.Action.beforeKickParticipant',
      wrappedError: e,
    });
  }
}
