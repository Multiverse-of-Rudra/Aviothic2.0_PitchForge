# SeniorSync

**Tagline:**
> When silence becomes a cry for help — SeniorSync listens.
**Team name-Pitchforge"
> members:
> sahil gautam
> sarthak kushwaha
> prankur verma
> Rudra Mohan Mishra(Team Leader)

## Overview
SeniorSync is an AI-powered guardian app for elderly safety. It detects emergencies (falls, silence, distress) using your phone’s sensors and microphone, and automatically alerts caregivers if something’s wrong.

## Features
- Detects falls and immobility using accelerometer/gyroscope
- Listens for abnormal silence, distress, or calls for help
- Learns daily sound/motion patterns and flags deviations
-- Sends SMS/voice alerts with location/context via Twilio
- Gentle voice prompt before escalation
- All processing on-device for privacy

## User Flow
1. **Passive Monitoring:** Runs in background, collects sensor/audio data
2. **Anomaly Detection:** AI/ML model flags unusual patterns
3. **Context Verification:** App asks user if they’re okay
4. **Emergency Response:** If no response, sends alert to caregivers

## Tech Stack
- **AI/ML:** TensorFlow Lite (on-device)
- **Sensors:** Android accelerometer, gyroscope, microphone
- **App:** Kotlin (Android)
- **Alerts:** Twilio, Firebase Cloud Messaging
- **Privacy:** No cloud audio storage

## Demo Scenario
1. Simulate a fall (shake/drop phone)
2. App detects impact + silence
3. Voice prompt: “Are you okay?”
4. No response → SMS alert sent
5. Caregiver receives alert with location

## Pitch Summary
Every year, millions of elderly people fall or suffer heart attacks alone — unable to reach for help. SeniorSync is an AI guardian that listens for distress through everyday sensors — your phone’s mic and motion data — and detects emergencies before it’s too late. When silence becomes dangerous, SeniorSync speaks up. Because not every emergency gets a call.

