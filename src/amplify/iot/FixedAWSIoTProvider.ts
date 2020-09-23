import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers'
import Paho from 'paho-mqtt';
import { MqttProvidertOptions } from '@aws-amplify/pubsub/lib/Providers/MqttOverWSProvider'

export class FixedAWSIoTProvider extends AWSIoTProvider {
   public async newClient({
		url,
		clientId,
	}: MqttProvidertOptions): Promise<any> {
		// console.log('FixedAWSIoTProvider - Creating new MQTT client', clientId);

		// @ts-ignore
		const client = new Paho.Client(url, clientId);
		// client.trace = (args) => logger.debug(clientId, JSON.stringify(args, null, 2));
		client.onMessageArrived = ({
			destinationName: topic,
			payloadString: msg,
		}) => {
         // Don't care!!!
         //@ts-ignore
			this._onMessage(topic, msg);
		};
		client.onConnectionLost = ({ errorCode, ...args }) => {
			this.onDisconnect({ clientId, errorCode, ...args });
		};

		await new Promise((resolve, reject) => {
			client.connect({
				useSSL: this.isSSLEnabled,
				mqttVersion: 3,
				onSuccess: () => {
               this.onSuccessfulConnection();
               resolve(client);
            },
				onFailure: () => resolve(client),
			});
		});

		return client;
   }

   public onSuccessfulConnection() {
      // Overwrite me!
   }
}