import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ITask, Actions } from '@twilio/flex-ui';
import ConferenceMonitor from '../ConferenceMonitor';
import ConferenceService from '../../../service/ConferenceService';
import { useSelector, useDispatch } from 'react-redux';

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
    },
    useFlexSelector: jest.fn(() => {
      return { ConferenceDialog: { isOpen: true } };
    }),
  };
});

describe('Conference Monitor', () => {
  it('should render correct snapshot', () => {
    const wrapper = render(<ConferenceMonitor />);
    expect(wrapper).toMatchSnapshot();
  });
});
