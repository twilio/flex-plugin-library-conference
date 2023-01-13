import * as Flex from '@twilio/flex-ui';
import ConferenceService from '../../service/ConferenceService';

export function handleKickConferenceParticipant(flex: typeof Flex, manager: Flex.Manager) {
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
}
