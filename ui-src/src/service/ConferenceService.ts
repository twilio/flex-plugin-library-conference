/* Created for use with external transfer extensions

  merged from excellent work done by Terence Rogers
  https://github.com/trogers-twilio/plugin-external-conference-warm-transfer

*/
import ApiService from './ApiService';
import { EncodedParams } from '../types/Params';
import { FetchedCall, FetchedConferenceParticipant } from '../types/twilio-api';

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
        .catch((error) => {
          console.error(`Error ${hold ? 'holding' : 'unholding'} participant ${participantSid}\r\n`, error);
          reject(error);
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
        .catch((error) => {
          console.error(`Error updating participant ${participantSid}\r\n`, error);
          reject(error);
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
        .catch((error) => {
          console.log('There is an error while adding participan', error);
          reject(error);
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
        .catch((error) => {
          console.error(`Error removing participant ${participantSid} from conference\r\n`, error);
          reject(error);
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
          console.log('The call properties are', resp.callProperties);
          resolve(resp.callProperties);
        })
        .catch((error) => {
          console.log('There is an error', error);
          reject(error);
        });
    });
  };
}

export default new ConferenceService();
