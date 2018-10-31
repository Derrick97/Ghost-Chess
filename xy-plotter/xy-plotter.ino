#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>

#include <MeOrion.h>

#define CommandsSize 25

struct command {
  int direction = 4;
  int distance = 0;
  boolean magnet =false;
}commands[25];

double angle_rad = PI/180.0;
double angle_deg = 180.0/PI;
MeSerial se;
MeStepper stepper_1(1);
MeStepper stepper_2(2);
double MaxSpeed = 100.0;
double Speed = 100.0;
double CellSize = 100.0;
MeLimitSwitch sw_3_1(3,1);
MeLimitSwitch sw_3_2(3,2);
MeLimitSwitch sw_6_1(6,1);
MeLimitSwitch sw_6_2(6,2);
char buffer[4];
// index: how many command in commands
int WriteIndex=0;
int ReadIndex=0;
bool available= true;



void setup(){
    Serial.begin(115200);
    Serial.println("Connected");
    pinMode(6, OUTPUT); 
}

void loop(){
      while(Serial.available()){
        delay(1000);
        if(Serial.available()>=4){
          Serial.println("wp 1");
          Serial.readBytes(buffer,4);
          char term = buffer[3];
          if (term=='#'){
          commands[WriteIndex].direction = buffer[0]-48;
          commands[WriteIndex].distance = buffer[1]-48;
          commands[WriteIndex].magnet = buffer[2]-48;
          Serial.println(commands[WriteIndex].distance);
//          Serial.read();
          WriteIndex++;
          Serial.write(buffer,3);
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
        //clearing serial data
//        else{
//          Serial.print(Serial.available());
          
//        }
  }
       Serial.println(available);
      if(commands[ReadIndex].distance!=0 && available){
        available = false;
       Serial.println("wp2");
       Serial.println(commands[ReadIndex].direction);
       Serial.println(commands[ReadIndex].distance);
       Serial.println(commands[ReadIndex].magnet);
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
      Serial.println("x:");
      Serial.println(x);
      Serial.println("y:");
      Serial.println(y);
      stepper_1.move(CellSize*x);
      stepper_1.setMaxSpeed(MaxSpeed);
      stepper_1.setSpeed(Speed);
      stepper_2.move(CellSize*y);
      stepper_2.setMaxSpeed(MaxSpeed);
      stepper_2.setSpeed(Speed);
      
      ReadIndex++;
      }  
      delay(10);
     _loop();
//}
}

void _delay(float seconds){
    long endTime = millis() + seconds * 1000;
    while(millis() < endTime)_loop();
}

void _loop(){
//  if(!stepper_1.runSpeedToPosition() && !stepper_2.runSpeedToPosition() && magnet == true){
//    digitalWrite(6,LOW);
//    }
bool steppe1 = stepper_1.runSpeedToPosition();
bool steppe2 = stepper_2.runSpeedToPosition();
  if (!steppe2 && !steppe1){
  available = true;
//  Serial.println("available");
  }
//  else{
//    Serial.println("moving");
//    }

}
