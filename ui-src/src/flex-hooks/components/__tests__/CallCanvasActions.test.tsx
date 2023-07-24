import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { addConferenceToCallCanvasActions } from '../CallCanvasActions';

describe('CallCanvas', () => {
  const flex: typeof Flex = Flex;
  const addContentSpy = jest.spyOn(Flex.CallCanvasActions.Content, 'add');

  it('adds ConferenceMonitor and Conference Dialog to call canvas', () => {
    addConferenceToCallCanvasActions(flex);
    expect(addContentSpy).toHaveBeenCalledTimes(1);
  });
});
