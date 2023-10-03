import { VERSION } from '@twilio/flex-ui';
import packageJSON from '../../package.json';
import FlexTelemetry from '@twilio/flex-ui-telemetry';

export enum Event {
  CONFERENCE_NUMBER_DIALED = 'Conference Number Dialed',
}

export const Analytics = new FlexTelemetry({
  source: 'flexui',
  role: packageJSON.name,
  plugin: packageJSON.name,
  pluginVersion: packageJSON.version,
  originalPluginName: packageJSON.id,
});