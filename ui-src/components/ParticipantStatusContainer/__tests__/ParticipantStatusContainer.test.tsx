import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParticipantStatusContainer from '../ParticipantStatusContainer';

describe('ParticipantStatusContainer', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('should render correct snapshot', () => {
    const wrapper = render(<ParticipantStatusContainer />);
    expect(wrapper).toMatchSnapshot();
  });
});
