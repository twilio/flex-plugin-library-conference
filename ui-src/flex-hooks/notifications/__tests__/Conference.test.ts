import * as Flex from '@twilio/flex-ui';
import failedHangupNotification from '../Conference';

describe('Conference notification', () => {
  let flex: typeof Flex = Flex;
  let manager: Flex.Manager = Flex.Manager.getInstance();
  const notificationSpy = jest.spyOn(Flex.Notifications, 'registerNotification');

  it('failedHangupNotification registers error notification', () => {
    failedHangupNotification(flex, manager);
    expect(notificationSpy).toHaveBeenCalled();
    expect(notificationSpy).toHaveBeenCalledWith({
      id: 'PS_FailedHangupOnConferenceWithExternalParties',
      type: 'error',
      content: 'PSConferenceFailedHangupNotification',
    });
  });
});
