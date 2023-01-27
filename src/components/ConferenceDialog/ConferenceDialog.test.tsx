import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ITask, Actions } from '@twilio/flex-ui';
import ConferenceDialog from './ConferenceDialog';
import ConferenceService from '../../service/ConferenceService';
import { useSelector, useDispatch } from 'react-redux';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch
}));
jest.mock('@twilio/flex-ui', () => {
    return {
      __esModule: true,
      Actions:{
        addListener: jest.fn(),
        removeListener: jest.fn(),
        invokeAction: jest.fn(),
      },
      Manager:{
        getInstance:jest.fn()
      },
      useFlexSelector: jest.fn(() => {return {ConferenceDialog: {isOpen: true}}})
    };
  });


describe('Conference Dialog', () => {
  // const t = { sid: '1672673' } as unknown as ITask;
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
    expect(invokeAction).toHaveBeenCalledWith('SetComponentState',{
      name: 'ConferenceDialog',
      state: { isOpen: false }
    });
  });

  it('should click Cancel button', () => {
    const invokeAction = jest.spyOn(Actions, 'invokeAction');
    const { getByTitle } = render(<ConferenceDialog />);
    const cancelButton = getByTitle('Cancel').closest('button');
    if (cancelButton) {
      fireEvent.click(cancelButton);
    }
    expect(invokeAction).toHaveBeenCalledWith('SetComponentState',{
      name: 'ConferenceDialog',
      state: { isOpen: false }
    });
  });

  it('should close dialog on esc press', () => {
    const invokeAction = jest.spyOn(Actions, 'invokeAction');
    const { getByTestId } = render(<ConferenceDialog />);
    fireEvent.click(getByTestId('modal-header').querySelector('button') as HTMLButtonElement);
    expect(invokeAction).toHaveBeenCalledWith('SetComponentState',{
      name: 'ConferenceDialog',
      state: { isOpen: false }
    });
  });

})