#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>

#include <MeOrion.h>

double angle_rad = PI/180.0;
double angle_deg = 180.0/PI;
MeSerial se;
MeStepper stepper_1(1);
MeStepper stepper_2(2);
int direction;
int distance;
boolean magnet =false;
double MaxSpeed = 100.0;
double Speed = 100.0;
double CellSize = 30.0;
MeLimitSwitch sw_3_1(3,1);
MeLimitSwitch sw_3_2(3,2);
MeLimitSwitch sw_6_1(6,1);
MeLimitSwitch sw_6_2(6,2);



void setup(){
    Serial.begin(9600);
    Serial.println("Connected");
    pinMode(6, OUTPUT); 
    
}

void loop(){
    
    while(Serial.available()){
        char command[3];
        Serial.readBytes(command,3);
        Serial.println(command);

        if ((String)command == "000") {
        }
        else{
        direction = command[0];
        distance = command[1];
        magnet = command[2];
        int x;
        int y;
//        switch (direction) {
//          case 48:
//          break;
//          break;
//          default:
//          break;
//        }
//        if (magnet){
//          digitalWrite(6, HIGH);
//          }
//      stepper_1.move(CellSize);
//      stepper_1.setMaxSpeed(MaxSpeed);
//      stepper_1.setSpeed(Speed);
//      stepper_2.move(CellSize);
//      stepper_2.setMaxSpeed(MaxSpeed);
//      stepper_2.setSpeed(Speed);
//         }
        }
//    
//    _loop(magnet);
}
}

void _delay(float seconds){
    long endTime = millis() + seconds * 1000;
    while(millis() < endTime)_loop(magnet);
}

void _loop(int magnet){
  if(!stepper_1.runSpeedToPosition() && !stepper_2.runSpeedToPosition() && magnet == true){
    digitalWrite(6,LOW);
    }
}
