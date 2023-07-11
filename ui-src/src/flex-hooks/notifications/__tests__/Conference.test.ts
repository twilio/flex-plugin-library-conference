import * as Flex from '@twilio/flex-ui';
import failedHangupNotification from '../Conference';

describe('Conference notification', () => {
  const flex: typeof Flex = Flex;
  const manager: Flex.Manager = Flex.Manager.getInstance();
  const notificationSpy = jest.spyOn(Flex.Notifications, 'registerNotification');

  it('failedHangupNotification registers error notification', () => {
    failedHangupNotification(flex, manager);
    expect(notificationSpy).toHaveBeenCalled();
    expect(notificationSpy).toHaveBeenCalledWith({
      id: 'FailedHangupOnConferenceWithExternalParties',
      type: 'error',
      content: 'ConferenceFailedHangupNotification',
    });
  });
});
