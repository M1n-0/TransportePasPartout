#include <Arduino.h>
#include "espcode.hpp"
#include <MFRC522v2.h>
#include <MFRC522DriverSPI.h>
//#include <MFRC522DriverI2C.h>
#include <MFRC522DriverPinSimple.h>
#include <iostream>

MFRC522DriverPinSimple ss_pin(5);
MFRC522DriverSPI driver{ss_pin};
MFRC522 mfrc522{driver};
MFRC522::MIFARE_Key key;

#define green_led = 27;
#define red_led = 26;

void setup(){
    Serial.begin(9600);  // Initialize serial communication
    while (!Serial); // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4).
    
    setup_RFID(&mfrc522, key);
}

void loop(){
    read(&mfrc522);
}