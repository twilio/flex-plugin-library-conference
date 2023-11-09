/* Created for use with external transfer extensions

  merged from excellent work done by Terence Rogers
  https://github.com/trogers-twilio/plugin-external-conference-warm-transfer

*/
import ApiService from './ApiService';
import { EncodedParams } from '../types/Params';
import { FetchedCall, FetchedConferenceParticipant } from '../types/twilio-api';
import { ErrorManager, FlexPluginErrorType } from '../utils/ErrorManager';

export interface GetCallResponse {
  success: boolean;
  callProperties: FetchedCall;
}

export interface ParticipantResponse {
  success: boolean;
  callSid: string;
}

export interface RemoveParticipantResponse {
  success: boolean;
}

class ConferenceService extends ApiService {
  _toggleParticipantHold = async (conference: string, participantSid: string, hold: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conference),
        participant: encodeURIComponent(participantSid),
        hold: encodeURIComponent(hold),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<ParticipantResponse>(`${this.serverlessDomain}/conference/hold-participant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      })
        .then((response: ParticipantResponse) => {
          console.log(`${hold ? 'Hold' : 'Unhold'} successful for participant`, participantSid);
          resolve(response.callSid);
        })
        .catch((e) => {
          console.error(`Error ${hold ? 'holding' : 'unholding'} participant ${participantSid}\r\n`, e);
          ErrorManager.createAndProcessError(
            `Error ${hold ? 'holding' : 'unholding'} participant ${participantSid}\r\n`,
            {
              type: FlexPluginErrorType.serverless,
              description:
                e instanceof Error
                  ? `${e.message}`
                  : `Error ${hold ? 'holding' : 'unholding'} participant ${participantSid}\r\n`,
              context: 'Plugin.ConferenceService',
              wrappedError: e,
            },
          );
          reject(e);
        });
    });
  };

  setEndConferenceOnExit = async (
    conference: string,
    participantSid: string,
    endConferenceOnExit: boolean,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conference),
        participant: encodeURIComponent(participantSid),
        endConferenceOnExit: encodeURIComponent(endConferenceOnExit),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<ParticipantResponse>(`${this.serverlessDomain}/conference/update-participant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      })
        .then((response: ParticipantResponse) => {
          console.log(`Participant ${participantSid} updated:\r\n`, response);
          resolve(response.callSid);
        })
        .catch((e) => {
          console.error(`Error updating participant ${participantSid}\r\n`, e);
          ErrorManager.createAndProcessError(`Error updating participant ${participantSid}\r\n`, {
            type: FlexPluginErrorType.serverless,
            description: e instanceof Error ? `${e.message}` : `Error updating participant ${participantSid}\r\n`,
            context: 'Plugin.ConferenceService',
            wrappedError: e,
          });
          reject(e);
        });
    });
  };

  addParticipant = async (taskSid: string, from: string, to: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        taskSid: encodeURIComponent(taskSid),
        from: encodeURIComponent(from),
        to: encodeURIComponent(to),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<ParticipantResponse>(`${this.serverlessDomain}/conference/add-participant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      })
        .then((response: ParticipantResponse) => {
          console.log('Participant added:\r\n  ', response);
          resolve(response.callSid);
        })
        .catch((e) => {
          console.log('There is an error while adding participant', e);
          ErrorManager.createAndProcessError(`Error while adding participant ${to}`, {
            type: FlexPluginErrorType.serverless,
            description: e instanceof Error ? `${e.message}` : `Error while adding participant ${to}`,
            context: 'Plugin.ConferenceService',
            wrappedError: e,
          });
          reject(e);
        });
    });
  };

  holdParticipant = (conference: string, participantSid: string): Promise<string> => {
    return this._toggleParticipantHold(conference, participantSid, true);
  };

  unholdParticipant = (conference: string, participantSid: string): Promise<string> => {
    return this._toggleParticipantHold(conference, participantSid, false);
  };

  removeParticipant = (conference: string, participantSid: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conference),
        participant: encodeURIComponent(participantSid),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<RemoveParticipantResponse>(`${this.serverlessDomain}/conference/remove-participant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      })
        .then((response: RemoveParticipantResponse) => {
          console.log(`Participant ${participantSid} removed from conference`);
          resolve(participantSid);
        })
        .catch((e) => {
          console.error(`Error removing participant ${participantSid} from conference\r\n`, e);
          ErrorManager.createAndProcessError(`Error removing participant ${participantSid} from conference\r\n`, {
            type: FlexPluginErrorType.serverless,
            description:
              e instanceof Error ? `${e.message}` : `Error removing participant ${participantSid} from conference\r\n`,
            context: 'Plugin.ConferenceService',
            wrappedError: e,
          });
          reject(e);
        });
    });
  };

  getCallProperties = async (callSid: string): Promise<FetchedCall> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        callSid: encodeURIComponent(callSid),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<GetCallResponse>(`${this.serverlessDomain}/conference/get-call-properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      })
        .then((resp: GetCallResponse) => {
          resolve(resp.callProperties);
        })
        .catch((e) => {
          console.log('There is an error', e);
          ErrorManager.createAndProcessError(`Error fetching call properties for call ${callSid}\r\n`, {
            type: FlexPluginErrorType.serverless,
            description: e instanceof Error ? `${e.message}` : `Error fetching call properties for call ${callSid}\r\n`,
            context: 'Plugin.ConferenceService',
            wrappedError: e,
          });
          reject(e);
        });
    });
  };
}

export default new ConferenceService();
