const express = require('express')
const expressWs = require('express-ws')
const app = express()

expressWs(app)

const cors = require('cors')
const port = 3000

app.use(cors())
app.use(express.json())

const subscriberRouter = require("./routes/subscriber");

app.get('/', (req, res) => res.send('Hello World!'))

app.use("/subscriber", subscriberRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))