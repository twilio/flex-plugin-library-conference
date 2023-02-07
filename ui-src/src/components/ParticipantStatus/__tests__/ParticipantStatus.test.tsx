import React from 'react';
import '@testing-library/jest-dom';
import { Template } from '@twilio/flex-ui';
import ParticipantStatus from '../ParticipantStatus';
import { render } from '@testing-library/react';
import fetch from 'jest-fetch-mock';
import '@testing-library/jest-dom';

describe('ParticipantStatus', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('renders ParticipantStatus with Hold', () => {
    const mockParticipant = {
      callSid: 'CSxxxxxx',
      onHold: true,
    };
    const { container, getByText } = render(<ParticipantStatus participant={mockParticipant} />);
    expect(getByText('CallParticipantStatusOnHold')).toBeInTheDocument();
  });

  it('renders ParticipantStatus with Live', () => {
    const { container, getByText } = render(<ParticipantStatus />);
    expect(getByText('CallParticipantStatusLive')).toBeInTheDocument();
  });

  it('renders ParticipantStatus with Hold', () => {
    const mockParticipant = {
      callSid: 'CSxxxxxx',
      status: 'recently_left',
    };
    const { container, getByText } = render(<ParticipantStatus participant={mockParticipant} />);
    expect(getByText('CallParticipantStatusLeft')).toBeInTheDocument();
  });

  it('renders ParticipantStatus with Hold', () => {
    const mockParticipant = {
      callSid: 'CSxxxxxx',
      connecting: true,
    };
    const { container, getByText } = render(<ParticipantStatus participant={mockParticipant} />);
    expect(getByText('CallParticipantStatusConnecting')).toBeInTheDocument();
  });
});
