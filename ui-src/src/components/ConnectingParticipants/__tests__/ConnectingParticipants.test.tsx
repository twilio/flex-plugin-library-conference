import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConnectingParticipants from '../ConnectingParticipants';
import { ConferenceState } from '@twilio/flex-ui/src/state/Conferences';
import * as Flex from '@twilio/flex-ui';

jest.mock('@twilio/flex-ui', () => {
  return {
    __esModule: true,
    Actions: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      invokeAction: jest.fn(),
    },
    TaskHelper: {
      isLiveCall: jest.fn(),
    },
    Manager: {
      getInstance: jest.fn(),
    },
    ParticipantCanvas: (props: any) => <div {...props} />,
  };
});
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: () => ({
    connectingParticipants: [
      {
        conferenceSid: '1672673',
        callSid: 'mockCallSid',
        phoneNumber: 'mockPhone',
      },
    ],
  }),
  useDispatch: () => mockDispatch,
}));

describe('Connecting Participant', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  const flex: typeof Flex = Flex;
  const manager: Flex.Manager = Flex.Manager.getInstance();
  const tsk = { conference: { conferenceSid: '1672673' } } as unknown as Flex.ITask;
  const conf = { source: { participants: [{ callSid: '167264' }] } } as unknown as ConferenceState;
  it('should render correct snapshot', () => {
    const wrapper = render(<ConnectingParticipants task={tsk} conference={conf} />);
    expect(wrapper).toMatchSnapshot();
  });

  // it('should rerender correct snapshot', () => {
  //   const tsk = { conference: { conferenceSid: '1672673' } } as unknown as Flex.ITask;
  //   const conf = { source: { participants: [{ callSid: '167264' }] } } as unknown as ConferenceState;
  //   const newConf = {
  //     source: { participants: [{ callSid: '167264' }, { callSid: '167265' }] },
  //   } as unknown as ConferenceState;
  //   const { rerender } = render(<ConnectingParticipants task={tsk} conference={conf} />);
  //   rerender(<ConnectingParticipants task={t} conference={newConf} />);
  //   expect(mockDispatch).toHaveBeenCalled();
  // });
});
