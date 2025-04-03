// #include "./espcode.hpp"

// void test(){
//   setup();
//   loop();
// }
#include <Arduino.h>
#include <MFRC522v2.h>
#include <MFRC522DriverSPI.h>
//#include <MFRC522DriverI2C.h>
#include <MFRC522DriverPinSimple.h>
#include <MFRC522Debug.h>
#include <SPI.h>      //include the SPI bus library
#include <MFRC522Debug.h>
#include <MFRC522Hack.h>
#include <iostream>

// Learn more about using SPI/I2C or check the pin assigment for your board: https://github.com/OSSLibraries/Arduino_MFRC522v2#pin-layout
MFRC522DriverPinSimple ss_pin(5);

MFRC522DriverSPI driver{ss_pin}; // Create SPI driver
//MFRC522DriverI2C driver{};     // Create I2C driver
MFRC522 mfrc522{driver};         // Create MFRC522 instance
//MFRC522DriverI2C driver();
MFRC522Hack mfrc522Hack(mfrc522, true);  // Create MFRC522Hack instance.
int block = 2;
byte blockAddress = 2;
byte newBlockData[17] = {"Rui Santos - RNT"};
//byte newBlockData[16] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};   // CLEAR DATA
byte bufferblocksize = 18;
byte blockDataRead[18];

MFRC522::MIFARE_Key key;
//"1: Read \n 2: Write"
int rep = 2;

void setup() {
  Serial.begin(9600);  // Initialize serial communication
  SPI.begin();
  while (!Serial);       // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4).
  
  mfrc522.PCD_Init();    // Init MFRC522 board.
  MFRC522Debug::PCD_DumpVersionToSerial(mfrc522, Serial);	// Show details of PCD - MFRC522 Card Reader details.
  Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));
  Serial.println(F("Warning: this example overwrites the UID of your UID changeable card, use with care!"));

  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
}
void loop() {

  if(rep == 2){
if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
  delay(500);
  return;
}

// Display card UID
Serial.print("----------------\nCard UID: ");
MFRC522Debug::PCD_DumpVersionToSerial(mfrc522, Serial);
Serial.println();

// Authenticate the specified block using KEY_A = 0x60
if (mfrc522.PCD_Authenticate(0x60, blockAddress, &key, &(mfrc522.uid)) != 0) {
  Serial.println("Authentication failed.");
  return;
}

// Write data to the specified block
if (mfrc522.MIFARE_Write(blockAddress, newBlockData, 16) != 0) {
  Serial.println("Write failed.");
} else {
  Serial.print("Data written successfully in block: ");
  Serial.println(blockAddress);
}

// Authenticate the specified block using KEY_A = 0x60
if (mfrc522.PCD_Authenticate(0x60, blockAddress, &key, &(mfrc522.uid)) != 0) {
  Serial.println("Authentication failed.");
  return;
}

// Read data from the specified block
if (mfrc522.MIFARE_Read(blockAddress, blockDataRead, &bufferblocksize) != 0) {
  Serial.println("Read failed.");
} else {
  Serial.println("Read successfully!");
  Serial.print("Data in block ");
  Serial.print(blockAddress);
  Serial.print(": ");
  for (byte i = 0; i < 16; i++) {
    Serial.print((char)blockDataRead[i]);  // Print as character
  }
  Serial.println();
}

// Halt communication with the card
mfrc522.PICC_HaltA();
mfrc522.PCD_StopCrypto1();
  }
  if(rep == 1){
Serial.print("read block");

for (int j=0;j<16;j++)
{
  Serial.write(blockDataRead[j]);
}
Serial.println("");
// Dump debug info about the card; PICC_HaltA() is automatically called.
MFRC522Debug::PICC_DumpToSerial(mfrc522, Serial, &(mfrc522.uid));
  }
delay(2000);  // Delay for readability
}