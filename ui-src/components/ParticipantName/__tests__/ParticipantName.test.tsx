import React from 'react';
import '@testing-library/jest-dom';
import * as Flex from '@twilio/flex-ui';
import ParticipantName from '../ParticipantName';
import { render } from '@testing-library/react';
import fetch from 'jest-fetch-mock';
import '@testing-library/jest-dom';

describe('ParticipantName', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('renders Name view', () => {
    const wrapper = render(<ParticipantName listMode={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders NameList view', () => {
    const wrapper = render(<ParticipantName listMode={true} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders NameList view with participantType customer', () => {
    const mockTask = {
      attributes: {
        name: 'mockName',
      },
    };
    const mockParticipant = {
      participantType: 'customer',
    };
    const { getByText } = render(<ParticipantName listMode={true} task={mockTask} participant={mockParticipant} />);
    expect(getByText('mockName')).toBeInTheDocument();
  });

  it('renders NameList view with participantType unknown', () => {
    const mockTask = {
      attributes: {
        name: 'mockName',
      },
    };
    const mockParticipant = {
      participantType: 'unknown',
      callSid: 'CSxxxxxx',
    };
    fetch.mockRejectOnce('Mock Error string');
    const { getByText } = render(<ParticipantName listMode={true} task={mockTask} participant={mockParticipant} />);
    expect(getByText('Unknown')).toBeInTheDocument();
  });

  it('renders NameList view with participantType unknown and no callSid', () => {
    const mockTask = {
      attributes: {
        name: 'mockName',
      },
    };
    const mockParticipant = {
      participantType: 'unknown',
    };
    const { getByText } = render(<ParticipantName listMode={true} task={mockTask} participant={mockParticipant} />);
    expect(getByText('Unknown')).toBeInTheDocument();
  });
});
