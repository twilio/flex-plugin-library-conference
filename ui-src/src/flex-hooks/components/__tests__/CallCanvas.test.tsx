import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { addConferenceToCallCanvas } from '../CallCanvas';

describe('CallCanvas', () => {
  let flex: typeof Flex = Flex;
  const addContentSpy = jest.spyOn(Flex.CallCanvas.Content, 'add');

  it('adds ConferenceMonitor and Conference Dialog to call canvas', () => {
    addConferenceToCallCanvas(flex);
    expect(addContentSpy).toHaveBeenCalledTimes(2);
  });
});
