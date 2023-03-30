import * as React from 'react';
import { Actions, Manager, ITask, useFlexSelector } from '@twilio/flex-ui';
import { useDispatch } from 'react-redux';
import { AppState } from '../../flex-hooks/states/ConferenceSlice';
import ConferenceService from '../../service/ConferenceService';

import { useUID } from '@twilio-paste/core/uid-library';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { PopoverContainer, Popover, PopoverButton } from '@twilio-paste/core/popover';
import { InformationIcon } from '@twilio-paste/icons/cjs/InformationIcon';
import { Text } from '@twilio-paste/core/text';
import { addConnectingParticipant } from '../../flex-hooks/states/ConferenceSlice';
import { ErrorManager, FlexPluginErrorType } from '../../utils/ErrorManager';

export interface OwnProps {
  task?: ITask;
}

const ConferenceDialog = (props: OwnProps) => {
  const [conferenceTo, setConferenceTo] = React.useState('');

  const componentViewStates = useFlexSelector((state: AppState) => state.flex.view.componentViewStates);
  const phoneNumber = useFlexSelector((state: AppState) => state.flex.worker.attributes.phone);

  const conferenceDialogState = componentViewStates && componentViewStates.ConferenceDialog;
  const isOpen = (conferenceDialogState && conferenceDialogState.isOpen) || false;

  const dispatch = useDispatch();
  const modalHeadingID = useUID();
  const inputRef = React.createRef<HTMLInputElement>();
  const inputID = useUID();

  const handleClose = () => {
    closeDialog();
  };

  const handleButtonClose = (e: React.MouseEvent<HTMLElement>) => {
    closeDialog();
    if (e) e.preventDefault();
  };

  const closeDialog = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'ConferenceDialog',
      state: { isOpen: false },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === 'Enter') {
      addConferenceParticipant();
      closeDialog();
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConferenceTo(value);
  };

  const handleDialButton = (e: React.MouseEvent<HTMLElement>) => {
    addConferenceParticipant();
    closeDialog();
    e.preventDefault();
  };

  const addConferenceParticipant = async () => {
    const { task } = props;

    if (!task) return;

    let mainConferenceSid = task.attributes.conference ? task.attributes.conference.sid : null;

    if (!mainConferenceSid && task.conference) {
      mainConferenceSid = task.conference.conferenceSid;
    }

    let from;
    if (phoneNumber) {
      from = phoneNumber;
    } else {
      from = Manager.getInstance().serviceConfiguration.outbound_call_flows.default.caller_id;
    }

    // Adding entered number to the conference
    console.log(`Adding ${conferenceTo} to conference`);
    let participantCallSid;
    try {
      participantCallSid = await ConferenceService.addParticipant(mainConferenceSid, from, conferenceTo);
      dispatch(
        addConnectingParticipant({
          callSid: participantCallSid,
          conferenceSid: mainConferenceSid,
          phoneNumber: conferenceTo,
        }),
      );
    } catch (e) {
      console.error('Error adding conference participant:', e);
      ErrorManager.createAndProcessError('Could not add participant to conference', {
        type: FlexPluginErrorType.serverless,
        description: e instanceof Error ? `${e.message}` : 'Could not add participant to conference',
        context: 'Plugin.ConferenceDialog',
        wrappedError: e,
      });
    }

    setConferenceTo('');
  };

  return (
    <Modal
      ariaLabelledby={modalHeadingID}
      isOpen={isOpen}
      onDismiss={handleClose}
      // set initial focus here
      initialFocusRef={inputRef}
      size="default"
      data-testid="modal-header"
    >
      <ModalHeader>
        <ModalHeading as="h3" id={modalHeadingID}>
          Add Conference Participant
        </ModalHeading>
      </ModalHeader>
      <ModalBody>
        <Box as="form">
          <Box display="flex" alignItems="center" marginBottom="space40">
            <Label htmlFor={inputID} marginBottom="space0">Phone Number</Label>
            <PopoverContainer baseId={`hint-popover`} placement="right">
              <PopoverButton variant="secondary_icon" size="icon_small">
                <InformationIcon decorative={false} title="Help link" color="colorTextLink" />
              </PopoverButton>
              <Popover aria-label="Popover" element="plugin-hint-popover">
                <Text as="span" marginRight="space20">
                  Phone number with country code: +1xxxxxxxxxx
                </Text>
              </Popover>
            </PopoverContainer>
          </Box>
          <Input
            id={inputID}
            value={conferenceTo}
            data-testid="phoneNumberInput"
            // assign the target ref here
            ref={inputRef}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            type="text"
          />
        </Box>
      </ModalBody>
      <ModalFooter>
        <ModalFooterActions>
          <Button variant="secondary" onClick={handleButtonClose} title="Cancel">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDialButton} title="Dial">
            Dial
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
};

export default ConferenceDialog;
