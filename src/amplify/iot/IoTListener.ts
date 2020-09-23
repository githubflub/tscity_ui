import Amplify, { Hub } from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'
import PubSub from '@aws-amplify/pubsub'
import { FixedAWSIoTProvider } from './FixedAWSIoTProvider'
import { onUsernameCapitalization } from './subtopic_handlers/onUsernameCapitalization';
import { IoTSubtopics } from '@tscity/shared/iot/subtopics'
import { onFriendRequestAccepted } from './subtopic_handlers/onFriendRequestAccepted';
import { onFriendRequestUnsent } from './subtopic_handlers/onFriendRequestUnsent';
import { onReceiveDM } from './subtopic_handlers/onReceiveDM'
import { getSession } from 'amplify/getSession';
import { parseCognitoSession } from 'amplify/parseCognitoUser';
import { onNewFriendRequest } from './subtopic_handlers/onNewFriendRequest';
import { ATTACH_USER_IOT_POLICY } from 'apollo/mutation/ATTACH_USER_IOT_POLICY';
import { RetryAgent } from 'utils/RetryAgent'

const DISCONNECTED_ERROR_CODE = 'Disconnected, error code'

export class IoTListener {
   private static instance_count = 0;
   private apollo_client;
   private dispatch;
   private getState;
   private active_subscriptions;
   private RetryAgent;

   constructor(args) {
      const { dispatch, apollo_client, getState } = args;
      this.dispatch = dispatch;
      this.apollo_client = apollo_client;
      this.getState = getState;

      this.connect();
      IoTListener.instance_count += 1;
      // console.log("IoTListener instances:", IoTListener.instance_count)

      // When user logs in, we'll need to update
      // subscribed topics, so create an auth listener.
      Hub.listen('auth', data => this.onAuthEvent(data));

      this.RetryAgent = new RetryAgent('IoTListener connect');
   }

   private async onAuthEvent(data) {
      // console.log("IoTListener - AuthEvent", data);
      const { payload } = data;
      switch (payload.event) {
         case 'signIn':
            // console.log("IoTListener - User signed in. Time to update subscriptions!")
            await this.attachIotPolicy();
            this.subscribe();
            break;
         default:
            // console.log(`No handler for ${payload.event} event.`)
      }
   }

   private async connect() {
      const IoTProvider = new FixedAWSIoTProvider({
         aws_pubsub_region: TS_AWS_REGION,
         aws_pubsub_endpoint: IOT_ENDPOINT_UI,
      })

      IoTProvider.onSuccessfulConnection = () => this.RetryAgent.onConnected();

      Amplify.addPluggable(IoTProvider)

      await this.attachIotPolicy();

      this.subscribe();
   }

   private async attachIotPolicy() {
      // Get identity_id
      const [session, identity_id] = await Promise.all([
         getSession(),
         Auth.currentCredentials().then(info => info.identityId),
      ]);

      // If there is a logged in user
      if (session) {
         try {
            const result = await this.apollo_client.mutate({
               mutation: ATTACH_USER_IOT_POLICY,
               variables: {
                  identity_id: identity_id
               }
            })
         }
         catch(error) {
            console.log('ERROR attachIoTPolicy', error);
         }
      }
   }

   private async subscribe() {
      // Need a flag to stop reconnect handler
      this.unsubscribe();
      const topics = ['tscity'];
      const session = await getSession();
      if (session && session.result) {
         const identity = parseCognitoSession(session.result)
         topics.push(`tscity/user/${identity.sub}`)
      }

      // console.log("IoTListener - Subscribing to topics", topics);
      const observable_topics = PubSub.subscribe(topics);
      this.RetryAgent.onConnectAttempt();
      this.active_subscriptions = observable_topics.subscribe({
         next: this.next.bind(this), // Bind this for access to apollo_client etc.
         error: this.onError.bind(this),
         complete: () => console.log("mqtt completed"),
      });
   }

   private onError(err) {
      console.error("IoTListener - MQTT Error", err);
      const error = err.error;
      if (typeof error === 'string') {
         // Disconnected (Ex. on network lost)
         if (error.startsWith(DISCONNECTED_ERROR_CODE)) {
            // console.log("IoTListener -", "Error was just a disconnection");
            this.reconnect();
         }
      }
      else if ( // Failed to connect
         error.errorCode === 7
         && !error.invocationContext
      ) {
         // console.log("IoTListener -", "Failed to connect 1");
         this.reconnect();
      }
      else if ( // Failed to connect
         error.message.endsWith('Invalid state not connected.')
      ) {
         // console.log("IoTListener -", "Failed to connect 2");
         this.reconnect();
      }
   }

   private unsubscribe() {
      if (this.active_subscriptions) {
         // This causes websocket to disconnect
         // does not throw a disconnection error.
         // Nice!
         this.active_subscriptions.unsubscribe();
      }

      this.active_subscriptions = null;
   }


   private next(data) {
      // console.log('IoTListener: Message received', data.value);
      // console.log(JSON.stringify(data.value))
      const subtopic: keyof typeof IoTSubtopics = data.value.subtopic || ''

      const tools = {
         dispatch: this.dispatch,
         getState: this.getState,
         apollo_client: this.apollo_client
      }
      switch (subtopic) {
         case IoTSubtopics.username_capitalization:
            onUsernameCapitalization(tools, data.value.message);
            break;
         case IoTSubtopics.friend_request_accepted:
            onFriendRequestAccepted(tools, data.value.message);
            break;
         case IoTSubtopics.new_friend_request:
            onNewFriendRequest(tools, data.value.message);
            break;
         case IoTSubtopics.receive_dm:
            onReceiveDM(tools, data.value.message);
            break;
         case IoTSubtopics.friend_request_unsent:
            onFriendRequestUnsent(tools, data.value.message);
            break;
         default:
            console.log("IoTListener - Unknown subtopic:", subtopic);
      }
   }

   private reconnect() {
      try {
         this.RetryAgent.retry(this.subscribe.bind(this))
      }
      catch (error) {
         console.error("IoT - reconnect error", error);
      }
   }
}