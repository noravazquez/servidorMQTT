const express = require('express')
const router = express.Router()
const { connectMqtt, subscribeToTopic } = require('../controllers/subscriber')

router.post("/", connectMqtt)
router.ws("/:clientId", subscribeToTopic)

module.exports = router;