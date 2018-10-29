const express = require("express");
const BodyParser = require("body-parser");
const SerialPort = require("serialport");

const app = express();
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

// Set up port to xy plotter (Port name might be different everytime)
const port = new SerialPort('COM3', { baudRate: 115200 });

app.get('/', (req, res) => {
  res.send('API working');
});

app.post('/movePlotter', (req, res) => {
  console.log(req.body.instructions);
  // Sends instruction to plotter serial port
  port.write('y');
  res.send("Done!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}`);
});