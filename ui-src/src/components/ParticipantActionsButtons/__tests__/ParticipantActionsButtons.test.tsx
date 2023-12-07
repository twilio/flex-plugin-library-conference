import React from 'react';
import '@testing-library/jest-dom';
import ParticipantActionsButtons from '../ParticipantActionsButtons';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as Flex from '@twilio/flex-ui';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

describe('ParticipantActionsButtons', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders ParticipantActionsButtons with correct snapshot', () => {
    const mockParticipant = {
      status: 'recently_left',
      callSid: 'CSxxxxxx',
    };
    const mockTask = {
      attributes: {
        name: 'mockName',
      },
    };
    const wrapper = render(<ParticipantActionsButtons listMode={true} participant={mockParticipant} task={mockTask} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('removes participant from current participants', () => {
    const mockParticipant = {
      status: 'recently_left',
      callSid: 'CSxxxxxx',
    };
    const mockTask = {
      attributes: {
        name: 'mockName',
      },
    };
    const actionSpy = jest.spyOn(Flex.Actions, 'invokeAction');
    const wrapper = render(<ParticipantActionsButtons listMode={true} participant={mockParticipant} task={mockTask} />);
    expect(actionSpy).toHaveBeenCalledTimes(1);
  });

  it('renders KickParticipantConfirmation view with correct snapshot', async () => {
    const mockParticipant = {
      status: 'recently_left',
      callSid: 'CSxxxxxx',
      onHold: true,
    };
    const mockTask = {
      attributes: {
        name: 'mockName',
      },
    };
    const component = render(
      <ParticipantActionsButtons listMode={false} participant={mockParticipant} task={mockTask} />,
    );
    const actionSpy = jest.spyOn(Flex.Actions, 'invokeAction');
    const confButton = component.getByTitle('Remove Participant').closest('button');
    fireEvent.click(confButton);
    expect(screen.getByTitle('Close')).toBeInTheDocument();
    expect(component.getByTitle('Accept')).toBeInTheDocument();
  });

  it('invokes the unhold action', () => {
    const mockParticipant = {
      status: 'joined',
      callSid: 'CSxxxxxx',
      workerSid: 'WSxxxxxx',
      onHold: true,
      participantType: 'worker',
    };
    const mockTask = {
      attributes: {
        name: 'mockName',
      },
    };
    const component = render(
      <ParticipantActionsButtons listMode={false} participant={mockParticipant} task={mockTask} />,
    );
    const actionSpy = jest.spyOn(Flex.Actions, 'invokeAction');
    const unholdButton = component.getByTitle('Unhold Participant').closest('button');
    if (unholdButton) {
      fireEvent.click(unholdButton);
    }
    expect(actionSpy).toHaveBeenCalledWith('UnholdParticipant', {
      participantType: 'worker',
      task: {
        attributes: {
          name: 'mockName',
        },
      },
      targetSid: 'WSxxxxxx',
    });
  });

  it('renders KickParticipantConfirmation view with correct snapshot and kicks a participant out', async () => {
    const mockParticipant = {
      status: 'recently_left',
      callSid: 'CSxxxxxx',
      workerSid: 'WSxxxxxx',
      onHold: true,
      participantType: 'worker',
    };
    const mockTask = {
      attributes: {
        name: 'mockName',
      },
    };
    const component = render(
      <ParticipantActionsButtons listMode={false} participant={mockParticipant} task={mockTask} />,
    );
    const actionSpy = jest.spyOn(Flex.Actions, 'invokeAction');
    const confButton = component.getByTitle('Remove Participant');
    fireEvent.click(confButton);
    const kickButton = component.getByTitle('Accept');
    fireEvent.click(kickButton);
    expect(actionSpy).toHaveBeenCalledWith('KickParticipant', {
      participantType: 'worker',
      task: {
        attributes: {
          name: 'mockName',
        },
      },
      targetSid: 'WSxxxxxx',
    });
  });
});
