import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ITask } from '@twilio/flex-ui';
import ConferenceDialog from './ConferenceDialog';

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


describe('Conference Dialog', () => {
  const t = { sid: '1672673' } as unknown as ITask;
  it('should render correct snapshot', () => {
    const wrapper = render(<ConferenceDialog />);
    expect(wrapper).toMatchSnapshot();
  });

})