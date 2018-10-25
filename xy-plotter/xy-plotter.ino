#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>

#include <MeOrion.h>

double angle_rad = PI/180.0;
double angle_deg = 180.0/PI;
MeSerial se;
MeStepper stepper_1(1);
MeStepper stepper_2(2);



void setup(){
    Serial.begin(115200);
    Serial.println("Connected");
    
}

void loop(){
    
    while(Serial.available()){
        char command = (char)Serial.read();
        if(command == 'x'){
            stepper_1.move(30);
            stepper_1.setMaxSpeed(100);
            stepper_1.setSpeed(100);
        }
        if(command == 'y'){
            stepper_2.move(30);
            stepper_2.setMaxSpeed(100);
            stepper_2.setSpeed(100);
        }
    }
    
    _loop();
}

void _delay(float seconds){
    long endTime = millis() + seconds * 1000;
    while(millis() < endTime)_loop();
}

void _loop(){
    stepper_1.runSpeedToPosition();
    
    stepper_2.runSpeedToPosition();
    
    
}

