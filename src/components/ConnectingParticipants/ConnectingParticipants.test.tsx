import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ITask } from '@twilio/flex-ui';
import ConnectingParticipants from './ConnectingParticipants';
import { ConferenceState } from '@twilio/flex-ui/src/state/Conferences';

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
    IconButton: (props: any) => <button {...props} />,
  };
});


describe('Connecting Participant', () => {
  const t = { sid: '1672673' } as unknown as ITask;
  const c = { sid: '167264' } as unknown as ConferenceState;
  it('should render correct snapshot', () => {
    const wrapper = render(<ConnectingParticipants task={t} conference={c} />);
    expect(wrapper).toMatchSnapshot();
  });

})