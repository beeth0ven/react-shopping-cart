import awsIot from 'aws-iot-device-sdk';
import config from './config';
import { Subject } from 'rx';

export default class IoT {

  constructor(keys) {
    this.client = null;
    this.accessKey = keys.accessKey;
    this.secretKey = keys.secretKey;
    this.sessionToken = keys.sessionToken;
    this.messageSubject = new Subject();
  }

  connect = () => {
    this.client = awsIot.device({
      region: config.iot.REGION,
      host: config.iot.ENDPOINT,
      accessKeyId: this.accessKey,
      secretKey: this.secretKey,
      sessionToken: this.sessionToken,
      port: 443,
      protocol: 'wss'
    });

    this.client.on('connect', this.handleConnect);
    this.client.on('message', this.handleMessage);
    this.client.on('close', this.handleClose);
    this.client.on('error', this.handleError);
    this.client.on('reconnect', this.handleReconnect);
    this.client.on('offline', this.handleOffline);
  };

  publish = (topic, message) => {
    this.client.push(topic, message);
  };

  subscribe = (topic) => {
    this.client.subscribe(topic);
  };

  handleConnect = () => {
    console.log('IoT handleConnect');
  };

  handleMessage = (topic, message) => {
    this.messageSubject.onNext({ topic, message });
  };

  handleClose = () => {
    console.log('IoT handleClose');
  };

  handleError = () => {
    console.log('IoT handleError');
  };

  handleReconnect = () => {
    console.log('IoT handleReconnect');
  };

  handleOffline = () => {
    console.log('IoT handleOffline');
  };
}