#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>

#include <MeOrion.h>

#define CommandsSize 25

struct command {
  int direction = 0;
  int distance = -1;
  boolean magnet =false;
}commands[40];

double angle_rad = PI/180.0;
double angle_deg = 180.0/PI;

MeStepper stepper_1(1);
MeStepper stepper_2(2);

double MaxSpeed = 100.0;
double Speed = 100.0;
double HalfCellSize = 95.24;

MePort port(4);

MeLimitSwitch sw_3_1(3,1);
MeLimitSwitch sw_3_2(3,2);
MeLimitSwitch sw_6_1(6,1);
MeLimitSwitch sw_6_2(6,2);

char buffer[4];

// index: how many command in commands
int WriteIndex=0;
int ReadIndex=0;
int o = 0;

bool motorAvailable = true;
bool serialIsAvailable = true;


void setup(){
    Serial.begin(115200);
    Serial.print("Connected");
}

void loop(){
    if (serialIsAvailable) {
      Serial.print("executed");
      Serial.println(o);
      o++;
      delay(2000);
      while(Serial.available()){
        delay(100);
        if(Serial.available()>=5){
          serialIsAvailable = false;
          Serial.println("wp 1");
          Serial.readBytes(buffer,5);
          Serial.write(buffer,4);
          char term = buffer[4];
//          int dir = buffer[0] - 48;
//          int dis = buffer[1] - 48;
//          int mag = buffer[2] - 48;
//          if (dir < 0 || dir > 7 || mag < 0 || mag > 1) {
//            validString = false;
//          }
          if (term=='#'){
          commands[WriteIndex].direction = buffer[0]-48;
          commands[WriteIndex].distance = (buffer[1]-48)*10 + buffer[2]-48;
          commands[WriteIndex].magnet = buffer[3]-48;
          Serial.println(commands[WriteIndex].distance);
//          Serial.read();
          WriteIndex++;
          Serial.write(buffer,4);
          Serial.println(Serial.available());
          Serial.println(WriteIndex);
           
        }
        else{
          Serial.write("Error terminator\n");
          }
        }
        else{
          while(Serial.available()){
           Serial.read();
          }
        
        }
      }
  }
//       Serial.println(motorAvailable);
      if(commands[ReadIndex].distance!=-1 && motorAvailable){
        motorAvailable = false;
       Serial.println("wp2");
       Serial.println(commands[ReadIndex].direction);
       Serial.println(commands[ReadIndex].distance);
       Serial.println(commands[ReadIndex].magnet);

        port.dWrite1(commands[ReadIndex].magnet);
        delay(100);
        
       int x = 0;
       int y = 0;
       switch (commands[ReadIndex].direction) {
          case 0: y = commands[ReadIndex].distance;          
          break;
          case 1: y = commands[ReadIndex].distance;
                   x = commands[ReadIndex].distance;
          break;
          case 2: x = commands[ReadIndex].distance;
          break;
          case 3: y = -1 * commands[ReadIndex].distance;
                 x = commands[ReadIndex].distance;
          case 4: y = -1 * commands[ReadIndex].distance;
          break;
          case 5: y = -1* commands[ReadIndex].distance;
                   x = -1* commands[ReadIndex].distance;
          break;
           case 6: x = -1* commands[ReadIndex].distance;
          break;
           case 7: y = commands[ReadIndex].distance;
                   x = -1* commands[ReadIndex].distance;
          break;
          default:
           break;
}
//      Serial.println("x:");
//      Serial.println(x);
//      Serial.println("y:");
//      Serial.println(y);
      stepper_1.move(HalfCellSize*x);
      stepper_1.setMaxSpeed(MaxSpeed);
      stepper_1.setSpeed(Speed);
      stepper_2.move(HalfCellSize*y);
      stepper_2.setMaxSpeed(MaxSpeed);
      stepper_2.setSpeed(Speed);
      
      ReadIndex++;
      } else if (motorAvailable == true) {
        serialIsAvailable = true;
        if (ReadIndex != 0) {
            WriteIndex = 0;
            ReadIndex = 0;
            for (int i = 0; i < 25; i++) {
              commands[i].distance = -1;
            }
         }
      }
      delay(10);
     _loop();
}

void _delay(float seconds){
    long endTime = millis() + seconds * 1000;
    while(millis() < endTime)_loop();
}

void _loop(){
bool steppe1 = stepper_1.runSpeedToPosition();
bool steppe2 = stepper_2.runSpeedToPosition();
  if (!steppe2 && !steppe1){
  motorAvailable = true;
  }

}
