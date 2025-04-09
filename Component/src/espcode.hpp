#ifndef ESP_RFID
#define ESP_RFID

#include <Arduino.h>
#include <MFRC522v2.h>
#include <MFRC522DriverSPI.h>
//#include <MFRC522DriverI2C.h>
#include <MFRC522DriverPinSimple.h>
#include <MFRC522Debug.h>
#include <SPI.h>

void setup_RFID(MFRC522 *mfrc522, MFRC522::MIFARE_Key key);
void read(MFRC522 *mfrc522);
void write(MFRC522 *mfrc522,  MFRC522::MIFARE_Key key);

#endif