const mqtt = require('mqtt')

const clients = {}

exports.connectMqtt = (req, res) => {
    const mqttHost = req.body.host;
    const mqttPort =  req.body.port;
    const mqttTopic =  req.body.topic;
    const mqttClientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const mqttConnectUrl = `mqtt://${mqttHost}:${mqttPort}`;

    const options = {
        clientId: mqttClientId,
        clean: true,
        connectTimeout: 4000,
        username: req.body.username,
        password: req.body.password,

        reconnectPeriod: 1000 
    };

    const mqttClient = mqtt.connect(mqttConnectUrl, options);

    mqttClient.on('connect', () => {

        console.log('Connected to MQTT');

        mqttClient.subscribe([mqttTopic], () => {      
            console.log(`Subscribed to topic ${mqttTopic}`);
            clients[mqttClientId] = mqttClient;
            res.json({ mqttClientId, message: "Connected to MQTT", topic: `Subscribed to topic ${mqttTopic}` });
        });
    });
}  

exports.subscribeToTopic = (ws, req) => {

    const clientId = req.params.clientId;

    if (ws.mqttClient) {
        ws.mqttClient.end();
    }

    const mqttClient = clients[clientId];

    if (!mqttClient) {
        ws.close();
        return;
    }

    ws.mqttClient = mqttClient;

    mqttClient.on('message', (topic, message) => {
        ws.send(JSON.stringify({ topic, message: message.toString() }));
    });

    ws.on('close', () => {
        if (ws.mqttClient) {
            ws.mqttClient.end();
        }
        delete clients[clientId];
    });
};