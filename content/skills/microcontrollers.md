---
title: Microcontrollers (Arduino, ESP32, STM32)
domain: specialist
level: intermediate
hours: 40–70
brief: Microcontrollers are tiny computers on a single chip. Programming them means working with GPIO pins, timers, interrupts and peripherals — with kilobytes of memory.
prereqs:
  - c-programming
  - electronics-basics
learn:
  - topic: GPIO
    detail: Reading buttons and driving LEDs and relays.
  - topic: Timers and PWM
    detail: Precise timing, dimming LEDs and controlling motors.
  - topic: Interrupts
    detail: Reacting to events immediately, and keeping handlers short.
  - topic: ADCs
    detail: Reading analogue sensors.
  - topic: Peripherals
    detail: UART, I2C and SPI hardware blocks.
  - topic: Memory and power
    detail: Fitting in flash and RAM; sleep modes for battery life.
  - topic: Debugging
    detail: Serial logging, debuggers (SWD/JTAG) and logic analysers.
  - topic: Platforms
    detail: Arduino for learning, ESP32 for Wi-Fi projects, STM32 for industry.
resources:
  - title: Arduino documentation
    url: https://docs.arduino.cc/
    provider: Arduino
    type: docs
    cost: free
    official: true
  - title: "ESP-IDF: Get started"
    url: https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/index.html
    provider: Espressif
    type: docs
    cost: free
    official: true
  - title: Embedded Systems – Shape the World (free course)
    url: https://users.ece.utexas.edu/~valvano/Volume1/E-Book/
    provider: Valvano & Yerraballi
    type: course
    cost: free
  - title: Wokwi (online simulator)
    url: https://wokwi.com/
    provider: Wokwi
    type: interactive
    cost: freemium
checked: 2026-10-06
---

## In plain English

A microcontroller is a whole computer — processor, memory and input/output — on a chip smaller than a fingernail. It's what runs inside a washing machine, a fitness band or a car's window switch. Programming one means talking directly to its pins and hardware blocks.

## Start cheap

An ESP32 board costs very little and has Wi-Fi built in. Wokwi lets you simulate one in the browser before you buy anything.
