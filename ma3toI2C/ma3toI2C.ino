#include <Wire.h>

// Uncomment the next line to get a debugging serial port output.
//#define SERIALOUT

#define I2C_ADDRESS 2

#define INTERRUPT_PIN 7
#define INTERRUPT_CHANNEL 4

// PWM taken from http://www.camelsoftware.com/firetail/blog/radio/reading-pwm-signals-from-a-remote-control-receiver-with-arduino/

//micros when the pin goes HIGH
volatile unsigned long timer_start;
volatile int pulse_time;

void calcSignal()
{
  //if the pin has gone HIGH, record the microseconds since the Arduino started up
  if (digitalRead(INTERRUPT_PIN) == HIGH) {
    timer_start = micros();
  }
  //otherwise, the pin has gone LOW
  else {
    //only worry about this if the timer has actually started
    if (timer_start > 0) {
      //record the pulse time
      pulse_time = ((volatile int)micros() - timer_start);
      //restart the timer
      timer_start = 0;
    }
  }
}

void setup() {

#ifdef SERIALOUT
  Serial.begin(115200);
#endif // serial

  // PWM
  timer_start = 0;
  attachInterrupt(INTERRUPT_CHANNEL, calcSignal, CHANGE);

  // I2C
  Wire.begin(I2C_ADDRESS);
  Wire.onRequest(requestEvent);
  Wire.onReceive(receiveEvent);
}

void loop() {
#ifdef SERIALOUT
  Serial.println(pulse_time);
  delay(100);
#endif // serial
}

void receiveEvent(int howMany) {
}

void requestEvent() {
  Wire.write((char *)&pulse_time, 2);
}

