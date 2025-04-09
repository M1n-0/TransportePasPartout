#include <Arduino.h>
#include "espcode.hpp"

byte blockAddress = 2;
byte bufferblocksize = 18;
byte blockDataRead[18];
byte newBlockData[17] = {""};


void setup_RFID(MFRC522 *mfrc522, MFRC522::MIFARE_Key key){
    SPI.begin();
    
    (*mfrc522).PCD_Init();    // Init MFRC522 board.
    MFRC522Debug::PCD_DumpVersionToSerial(*mfrc522, Serial);	// Show details of PCD - MFRC522 Card Reader details.
    Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));
    Serial.println(F("Warning: this example overwrites the UID of your UID changeable card, use with care!"));
  
    for (byte i = 0; i < 6; i++) {
      key.keyByte[i] = 0xFF;
    }
}

void read(MFRC522 *mfrc522){
    if (!(*mfrc522).PICC_IsNewCardPresent() || !(*mfrc522).PICC_ReadCardSerial()) {
        delay(500);
        return;
      }
    Serial.print("read block");
  
    for (int j=0;j<16;j++)
    {
      Serial.write(blockDataRead[j]);
    }
    Serial.println("");
  // Dump debug info about the card; PICC_HaltA() is automatically called.
  MFRC522Debug::PICC_DumpToSerial((*mfrc522), Serial, &((*mfrc522).uid));
  delay(2000);
}

void write(MFRC522 *mfrc522,  MFRC522::MIFARE_Key key){
  if (!(*mfrc522).PICC_IsNewCardPresent() || !(*mfrc522).PICC_ReadCardSerial()) {
      delay(500);
      return;
    }
    // Display card UID
    Serial.print("----------------\nCard UID: ");
    MFRC522Debug::PCD_DumpVersionToSerial((*mfrc522), Serial);
    Serial.println();
    
    // Authenticate the specified block using KEY_A = 0x60
    if ((*mfrc522).PCD_Authenticate(0x60, blockAddress, &key, &((*mfrc522).uid)) != 0) {
      Serial.println("Authentication failed.");
      return;
    }
    // Write data to the specified block
    if ((*mfrc522).MIFARE_Write(blockAddress, newBlockData, 16) != 0) {
      Serial.println("Write failed.");
    } else {
      Serial.print("Data written successfully in block: ");
      Serial.println(blockAddress);
    }
    
    // Authenticate the specified block using KEY_A = 0x60
    if ((*mfrc522).PCD_Authenticate(0x60, blockAddress, &key, &((*mfrc522).uid)) != 0) {
      Serial.println("Authentication failed.");
      return;
    }
    
    // Read data from the specified block
    if ((*mfrc522).MIFARE_Read(blockAddress, blockDataRead, &bufferblocksize) != 0) {
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
    
    // Halt communication with the card
    (*mfrc522).PICC_HaltA();
    (*mfrc522).PCD_StopCrypto1();
    delay(2000);
      }
  }