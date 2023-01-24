import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParticipantStatusContainer from './ParticipantStatusContainer';

describe('ParticipantStatusContainer', () => {
  it('should render correct snapshot', () => {
    const wrapper = render(<ParticipantStatusContainer />);
    expect(wrapper).toMatchSnapshot();
  });
});
