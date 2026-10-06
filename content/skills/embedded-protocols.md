---
title: Embedded Protocols (UART, I2C, SPI, MQTT)
domain: specialist
level: intermediate
hours: 20–30
brief: How chips, sensors and devices talk to each other — the wired buses inside a device (UART, I2C, SPI) and the messaging protocols that connect devices to the cloud (MQTT).
prereqs:
  - microcontrollers
learn:
  - topic: UART
    detail: Simple serial communication — the debug console of most boards.
  - topic: I2C
    detail: Two wires, many devices, addressed by number.
  - topic: SPI
    detail: Faster, full-duplex communication with chip-select lines.
  - topic: Reading timing diagrams
    detail: Clock polarity, phase and what the datasheet expects.
  - topic: Logic analysers
    detail: See exactly what's on the wire when things don't work.
  - topic: MQTT
    detail: Lightweight publish/subscribe messaging for IoT devices.
  - topic: Connectivity
    detail: Wi-Fi, Bluetooth Low Energy and when to use each.
resources:
  - title: MQTT
    url: https://mqtt.org/
    provider: MQTT.org
    type: docs
    cost: free
    official: true
  - title: "SparkFun: Serial communication"
    url: https://learn.sparkfun.com/tutorials/serial-communication
    provider: SparkFun
    type: article
    cost: free
  - title: "SparkFun: I2C"
    url: https://learn.sparkfun.com/tutorials/i2c
    provider: SparkFun
    type: article
    cost: free
  - title: "SparkFun: Serial Peripheral Interface (SPI)"
    url: https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi
    provider: SparkFun
    type: article
    cost: free
  - title: MQTT Essentials
    url: https://www.hivemq.com/mqtt/
    provider: HiveMQ
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

A temperature sensor doesn't speak English — it speaks I2C. Embedded protocols are the languages chips use to exchange bytes, and MQTT is how millions of small devices send their readings to the cloud without draining their batteries.
