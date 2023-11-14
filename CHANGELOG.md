## version 1.0.1

- Introduced the usage of flex-ui-telemetry package instead of individual classes.
- Introduced the usage of flex-plugins-library-utils package, which is a helper package with all the common twilio-functions readily used amongst the plugins.
- Added a feature which displays the connecting participants and lets user take action (Kick Out) even before connecting the conference.

## version 1.0.0

When in a call, a "plus" icon is added to the Call Canvas where you can add a external number to the call. This action executes a Twilio Function that uses the Twilio API to make a call and add this call to the current conference. In the Flex UI side, the participant is added manually and both hold/unhold and hangup buttons are available.