import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from '../../../../test-utils/renderer'
import '@testing-library/jest-dom';
import { ITask, Actions } from '@twilio/flex-ui';
import ConferenceDialog from '../ConferenceDialog';
import ConferenceService from '../../../service/ConferenceService';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('@twilio/flex-ui', () => {
  return {
    __esModule: true,
    Actions: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      invokeAction: jest.fn(),
    },
    Manager: {
      getInstance: jest.fn(),
      serviceConfiguration: {
        outbound_call_flows: {
          default: {
            caller_id: '+1xxxxxxxx',
          },
        },
      },
    },
    useFlexSelector: jest.fn(() => {
      return { ConferenceDialog: { isOpen: true } };
    }),
  };
});

jest.mock('../../../service/ConferenceService');

describe('Conference Dialog', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('should render correct snapshot', () => {
    const wrapper = render(<ConferenceDialog />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should click Cancel button', () => {
    const invokeAction = jest.spyOn(Actions, 'invokeAction');
    const { getByTitle } = render(<ConferenceDialog />);
    const cancelButton = getByTitle('Cancel').closest('button');
    if (cancelButton) {
      fireEvent.click(cancelButton);
    }
    expect(invokeAction).toHaveBeenCalledWith('SetComponentState', {
      name: 'ConferenceDialog',
      state: { isOpen: false },
    });
  });

  it('should click Cancel button', () => {
    const invokeAction = jest.spyOn(Actions, 'invokeAction');
    const { getByTitle } = render(<ConferenceDialog />);
    const cancelButton = getByTitle('Cancel').closest('button');
    if (cancelButton) {
      fireEvent.click(cancelButton);
    }
    expect(invokeAction).toHaveBeenCalledWith('SetComponentState', {
      name: 'ConferenceDialog',
      state: { isOpen: false },
    });
  });

  it('should close dialog on esc press', () => {
    const invokeAction = jest.spyOn(Actions, 'invokeAction');
    const { getByTestId } = render(<ConferenceDialog />);
    fireEvent.click(getByTestId('modal-header').querySelector('button') as HTMLButtonElement);
    expect(invokeAction).toHaveBeenCalledWith('SetComponentState', {
      name: 'ConferenceDialog',
      state: { isOpen: false },
    });
  });

  it('should add dialed number to current conference on click of dial button', () => {
    const mockTask = {
      attributes: {
        conference: {
          sid: '+111',
        },
      },
    };
    const { getByTitle, getByTestId } = render(<ConferenceDialog task={mockTask} />);
    const phoneNumber = getByTestId('phoneNumberInput');
    if (phoneNumber) {
      fireEvent.change(phoneNumber, {
        target: { value: '+1xxxxxx' },
      });
    }
    const dialButton = getByTitle('Dial').closest('button');
    if (dialButton) {
      fireEvent.click(dialButton);
    }
    expect(ConferenceService.addParticipant).toHaveBeenCalled();
  });

  it('should add dialed number to current conference on press of enter button', () => {
    const mockTask = {
      attributes: {
        conference: {
          sid: '+111',
        },
      },
    };
    const { getByTitle, getByTestId } = render(<ConferenceDialog task={mockTask} />);
    const phoneNumber = getByTestId('phoneNumberInput');
    if (phoneNumber) {
      fireEvent.change(phoneNumber, {
        target: { value: '+1xxxxxx' },
      });
      fireEvent.keyPress(phoneNumber, { key: 'Enter', code: 13, charCode: 13 });
    }
    expect(ConferenceService.addParticipant).toHaveBeenCalled();
  });
});
