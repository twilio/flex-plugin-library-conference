import React, { useEffect, useState } from 'react';
import * as Flex from '@twilio/flex-ui';
import { ConferenceState } from '@twilio/flex-ui/src/state/Conferences';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../flex-hooks/states/ConferenceSlice';
import { removeConnectingParticipant } from '../../flex-hooks/states/ConferenceSlice';
import ConferenceService from '../../service/ConferenceService';
import { FetchedCall } from '../../types/twilio-api';
import { ErrorManager, FlexPluginErrorType } from '../../utils/ErrorManager';

export interface OwnProps {
  conference?: ConferenceState;
  task?: Flex.ITask;
}

const ConnectingParticipants = (props: OwnProps) => {
  const [clock, setClock] = useState(true);

  const dispatch = useDispatch();
  const { connectingParticipants } = useSelector((state: AppState) => state[reduxNamespace]);
  useEffect(() => {
    // set up interval for cleaning up disconnected participants
    const interval = setInterval(() => {
      setClock((clock) => !clock);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    connectingParticipants
      ?.filter((p) => p.conferenceSid === props.task?.conference?.conferenceSid)
      .forEach((participant) => {
        // if this call is no longer active, remove it
        ConferenceService.getCallProperties(participant.callSid)
          .then((response: FetchedCall) => {
            if (
              response &&
              response.status !== 'ringing' &&
              response.status !== 'queued' &&
              response.status !== 'in-progress'
            ) {
              dispatch(removeConnectingParticipant(participant.callSid));
            }
          })
          .catch((e) => {
            console.log('ConnectingParticipant unable to check call status', e);
            ErrorManager.createAndProcessError(`Unable to check call status`, {
              type: FlexPluginErrorType.serverless,
              description: e instanceof Error ? `${e.message}` : `Unable to check call status`,
              context: 'Plugin.ConnectingParticipant',
              wrappedError: e,
            });
          });
      });
  }, [clock]);

  useEffect(() => {
    connectingParticipants
      ?.filter((p) => p.conferenceSid === props.task?.conference?.conferenceSid)
      .forEach((participant) => {
        const connected = props.conference?.source.participants.filter((p) => p.callSid === participant.callSid);
        // remove connecting participant once connected
        if (connected && connected.length > 0) {
          dispatch(removeConnectingParticipant(participant.callSid));
        }
      });
  }, [props.conference]);

  return (
    <>
      {connectingParticipants
        ?.filter((p) => p.conferenceSid === props.task?.conference?.conferenceSid)
        .map((p, idx) => {
          const fakeParticipant = {
            participantType: 'external',
            phoneNumber: p.phoneNumber,
            connecting: true,
            callSid: p.callSid,
          } as Flex.ConferenceParticipant;

          return (
            <Flex.ParticipantCanvas
              key={`participant_${idx}`}
              participant={fakeParticipant}
              participantWidth={100}
              conference={props.conference}
              task={props.task}
            />
          );
        })}
    </>
  );
};

export default ConnectingParticipants;
