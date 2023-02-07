import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { addConferenceToParticipantCanvas } from '../ParticipantCanvas';

describe('CallCanvas', () => {
  let flex: typeof Flex = Flex;
  const addContentSpy = jest.spyOn(Flex.ParticipantCanvas.Content, 'add');
  const removeContentSpy = jest.spyOn(Flex.ParticipantCanvas.Content, 'remove');
  const addListItemSpy = jest.spyOn(Flex.ParticipantCanvas.ListItem.Content, 'add');
  const removeListItemSpy = jest.spyOn(Flex.ParticipantCanvas.ListItem.Content, 'remove');

  it('adds ConferenceMonitor and Conference Dialog to call canvas', () => {
    addConferenceToParticipantCanvas(flex);
    expect(addContentSpy).toHaveBeenCalledTimes(3);
    expect(removeContentSpy).toHaveBeenCalledTimes(3);
    expect(addListItemSpy).toHaveBeenCalledTimes(2);
    expect(removeListItemSpy).toHaveBeenCalledTimes(2);
  });
});
