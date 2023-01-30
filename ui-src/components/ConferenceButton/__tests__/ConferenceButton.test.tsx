import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ITask, Actions, TaskHelper } from '@twilio/flex-ui';
import ConferenceButton from '../ConferenceButton';

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

describe('Conference Button', () => {
  const t = { sid: '1672673' } as unknown as ITask;
  it('should render correct snapshot', () => {
    TaskHelper.isLiveCall = () => {
      return true;
    };
    const wrapper = render(<ConferenceButton task={t} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render enabled button', () => {
    TaskHelper.isLiveCall = () => {
      return true;
    };
    const { getByTitle } = render(<ConferenceButton task={t} />);
    expect(getByTitle('Add Conference Participant').closest('button')).not.toBeDisabled();
  });

  it('should render disabled button', () => {
    const { getByTitle } = render(<ConferenceButton />);
    expect(getByTitle('Add Conference Participant').closest('button')).toBeDisabled();
  });

  it('should invoke an action when the icon button is clicked', async () => {
    const invokeAction = jest.spyOn(Actions, 'invokeAction');
    TaskHelper.isLiveCall = () => {
      return true;
    };
    const { getByTitle } = render(<ConferenceButton task={t} />);
    const confButton = getByTitle('Add Conference Participant').closest('button');
    if (confButton) {
      fireEvent.click(confButton);
    }
    expect(invokeAction).toHaveBeenCalledWith('SetComponentState', {
      name: 'ConferenceDialog',
      state: { isOpen: true },
    });
  });
});
