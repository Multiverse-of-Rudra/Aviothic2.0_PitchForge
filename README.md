# Senior Sync — Web Prototype

When silence becomes a cry for help — Senior Sync listens.

Senior Sync is a privacy-first web prototype built to explore how on-device sensor fusion and lightweight ML can help older adults and their caregivers detect potential emergencies at home and respond quickly.

Contents
- `index.html` — landing page and interactive demo UI
- `style.css` — styles and responsive layout
- `app.js` — demo logic (detection simulation, voice prompt, and escalation)
- `screenshots/` — optional UI snapshots

Quick start (no server required)
1. Open `index.html` in your browser.
2. Click a simulation button: **Simulate Fall**, **Simulate Silence**, or **Simulate Breathing**.
3. When the voice prompt appears, click **I'm fine** to cancel or **No response** to simulate escalation.

Behavior and privacy
- This prototype simulates on-device detection and alerting to demonstrate interaction flows. It does not send real alerts.
- A production implementation must perform audio/sensor processing on-device (or only with explicit user consent), require explicit permissions for location and contacts, and store/share sensitive data only with informed consent and secure handling.

Tech stack (prototype)
- Frontend: Static HTML/CSS/JS
- Mobile (production): Kotlin / Flutter + TensorFlow Lite for on-device inference
- Notifications/Alerts (production): Twilio, FCM/APNs, or carrier-grade services (with privacy and legal review)

Next steps to production
- Implement secure on-device feature extraction and TFLite model integration
- Build native mobile app to access sensors reliably and manage background processing and power usage
- Design consent flows, privacy policy, and caregiver onboarding
- Conduct user testing with older adults and caregivers and iterate on accessibility and UX

Suggested commit
```
git init
git add .
git commit -m "Senior Sync: web prototype — interactive detection and alert simulation"
```

If you'd like, I can:
- Create a short demo GIF or MP4 from the UI for onboarding
- Draft a privacy-first technical appendix describing on-device processing and data minimization
- Generate a 3-slide pitch or product one-pager aimed at caregivers and clinical partners
# CareCall — Web Demo
This is a simple web demo of CareCall (hackathon prototype). It simulates background monitoring, a voice prompt, and escalation to alerts.

Files:
- index.html — single-page demo
- style.css — styling
- app.js — simulation logic
- demo.gif — short demo animation
- screenshots — three PNG screenshots showing app states

How to run locally:
1. Unzip `carecall_web.zip` and open `index.html` in your browser (no server required).
2. Click **Simulate Fall** / **Simulate Prolonged Silence** / **Simulate Distressed Breathing** to see the flow.
3. Use **Respond "I'm fine"** to cancel, or **No response** to escalate.

Suggested commit:
```
git init
```markdown
# Senior Sync — Web Prototype
"When silence becomes a cry for help — Senior Sync listens."

Senior Sync is a privacy-first prototype designed to assist older adults and caregivers by detecting potential emergencies using phone sensors and lightweight on-device ML.

Files:
- `index.html` — landing page and interactive prototype
- `style.css` — styling and responsive layout
- `app.js` — simulation of detection, voice prompt, and escalation
- `screenshots/` — optional PNG screenshots demonstrating UI states

Quick run (no server required):
1. Open `index.html` in your browser.
2. Click a simulation button: **Simulate Fall**, **Simulate Silence**, or **Simulate Breathing**.
3. When the voice prompt appears, click **I'm fine** to cancel or **No response** to escalate the simulated alert.

Notes:
- This web prototype simulates detection and alerting flows for demonstration and user testing. A production mobile app would implement on-device ML (TensorFlow Lite), robust sensor fusion, permissioned location and alert delivery, and strict privacy protections (no cloud audio storage without consent).
- If your browser supports the Web Speech API, the demo will vocalize the prompt and alert messages for a more realistic experience.

Suggested commit message:
```
git init
git add .
git commit -m "Senior Sync: web prototype — interactive detection and alert simulation"
```

Suggested deliverables for deployment or user testing:
- This prototype (index.html, app.js, style.css)
- A short demo video or GIF for onboarding and stakeholder review
- User testing notes and privacy policy draft

```
