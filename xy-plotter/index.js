const express = require("express");
const BodyParser = require("body-parser");
const SerialPort = require("serialport");

const app = express();
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

// Set up port to xy plotter (Port name might be different everytime)
const port = new SerialPort('COM3', { baudRate: 115200 });

let instructions = [];


app.get('/', (req, res) => {
  res.send('API working');
});

port.on('data', function (data) {
  console.log(String(data));
  if (String(data).substring(0, 8) === 'executed' && instructions.length > 0) {
    port.write(instructions.shift());
  }
});



app.post('/movePlotter', (req, res) => {
  // Sends instruction to plotter serial port
  //console.log(req.body.instructions);
  instructions.push(req.body.instructions);
  
  res.send("Done!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}`);
});