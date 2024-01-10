const mqtt = require("mqtt");

var mqttClient;

const mqttHost = '45.132.241.62';
const mqttPort = '1883';
const mqttProtocol = 'mqtt';

function connectToBroker() {
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    const connectUrl = `${mqttProtocol}://${mqttHost}:${mqttPort}`;

    const options = {
        clientId,
        clean: true,
        connectTimeout: 30 * 1000,
        username: 'dave',
        password: 'efKcIj1vMeng1UFCyDtY',
        reconnectPeriod: 1000,
    };

    mqttClient = mqtt.connect(connectUrl, options);

    mqttClient.on('error', (error) => {
        console.log("Error: ", error);
        mqttClient.end();
    });

    mqttClient.on("reconnect", () => {
        console.log("Reconnecting...");
    });

    mqttClient.on("connect", () => {
        console.log("Client connected: " + clientId);
    });

    mqttClient.on("message", (topic, message, packet) => {
        console.log("Received Message: " + message.toString() + "\nOn topic: " + topic);
    });
}

function suscribeToTopic(topic) {
    console.log(`Suscribing to Topic: ${topic}`);

    mqttClient.subscribe(topic, { qos: 0 });
}

connectToBroker();
suscribeToTopic("humedad");