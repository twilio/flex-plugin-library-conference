# Native Flex Dialpad Add-on for External Conferences

## How it works

This plugin uses Twilio Functions and WorkerClient's createTask method to create conferences and TaskRouter tasks for orchestration in both agent-to-agent calls and external transfers features.

### External transfer (Conference)

When in a call, a "plus" icon is added to the Call Canvas where you can add a external number to the call. This action executes a Twilio Function that uses the Twilio API to make a call and add this call to the current conference. In the Flex UI side, the participant is added manually and both hold/unhold and hangup buttons are available.

An invisible component is mounted to track participant state and set endConferenceOnExit appropriately to allow for external transfer functionality -- the agent can leave the call while the remaining conference participants continue to communicate. If there are two parties remaining, the call will automatically end when one of them hangs up.

This feature is based on the work on this [project](https://github.com/twilio-labs/plugin-flex-outbound-dialpad).

# Configuration

## Outbound Call Configuration

When conferencing in an external party, the default outbound call settings are used for caller ID. If this has not yet been configured, you will encounter errors. This can be updated in the Twilio Console > Flex > Manage > Voice, or by using the Flex Configuration API:

```
POST https://flex-api.twilio.com/v1/Configuration
Authorization: Basic {base64-encoded Twilio Account SID : Auth Token}
Content-Type: application/json

{
  "account_sid": "Enter your Twilio Account SID here",
  "outbound_call_flows": {
    "default": {
      "workflow_sid": "WWxxxc",
      "enabled": true,
      "queue_sid": "WQxxx",
      "caller_id": "+1xxx",
      "location": "US"
    }
  },
}
```

## Flex Plugin

This repository is a Flex plugin with some other assets. The following describing how you setup, develop and deploy your Flex plugin.

### Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
cd

# If you use npm
npm install
```

### Development

In order to develop locally, you can use the Twilio CLI to run the plugin locally. Using your commandline run the following from the root dirctory of the plugin.

```bash
twilio flex:plugins:start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:3000`.

When you make changes to your code, the browser window will be automatically refreshed.

### Deploy

#### Plugin Deployment

Once you are happy with your plugin, you have to deploy then release the plugin for it to take affect on Twilio hosted Flex.

Run the following command to start the deployment:

```bash
twilio flex:plugins:deploy --major --changelog "Notes for this version" --description "Functionality of the plugin"
```

After your deployment runs you will receive instructions for releasing your plugin from the bash prompt. You can use this or skip this step and release your plugin from the Flex plugin dashboard here https://flex.twilio.com/admin/plugins

For more details on deploying your plugin, refer to the [deploying your plugin guide](https://www.twilio.com/docs/flex/plugins#deploying-your-plugin).

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.

## Twilio Serverless

You will need the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) and the [serverless plugin](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started) to deploy the functions inside the `serverless` folder of this project. You can install the necessary dependencies with the following commands:

`npm install twilio-cli -g`

and then

`twilio plugins:install @twilio-labs/plugin-serverless`

# How to use

1. Setup all dependencies above: the workflow and Twilio CLI packages.

2. Clone this repository

3. Copy `.env.example` to `.env` and set the following variables:

   - REACT_APP_SERVICE_BASE_URL: your Twilio Functions base url (this will be available after you deploy your functions). In local development environment, it could be your localhost base url.
   - REACT_APP_TASK_CHANNEL_SID: the voice channel SID

   **Note**: Remember that .env is for front-end use so do not add any type of key/secret variable to them. When developing, the .env.development is used while the .env.production is used when building and deploying the plugin. Also, just variables starting with the name _REACT*APP*_ will work.

4. run `npm install`

5. copy `./serverless/.env.sample` to `./serverless/.env` and populate the appropriate environment variables.

```
ACCOUNT_SID=
AUTH_TOKEN=
TWILIO_WORKFLOW_SID=
TWILIO_WORKSPACE_SID=
TWILIO_NUMBER=
```

6.  cd into ./serverless/ then run

`npm install`

and then

`twilio serverless:deploy`

(optionally you can run locally with `twilio serverless:start --ngrok=""`)