<h1 align="center">Ring Relay</h1>

<p align="center">
  <img src="/src/visual_assets/logof.svg"></img>
</p>

## Status
```diff
+ Front-end required for the initial release completed [This repo]
+ Back-end required for the initial release completed [Ring-Relay-API-Prod] +
```

## Documentation
There is a document in the ``/docs`` folder that contains an in-depth dive into how this app works, how to use it, and more.

## About

An end-to-end encrypted messaging application using public-key cryptography for encrypting and authenticating messages. This app also has a comprehensive set of features for the users to manage their accounts, private keys, contacts, and preferences.

## Features

### Security
▣ End-to-end encryption for all message types and modes <br>
This means that only the private keys your device stores locally can decrypt messages meant for you.

▣ Message Authentication using ECDSA <br>
This Sign/Verify process ensures the origin of the messages you're receiving (who wrote it) and its integrity (no tempering at any point during transit).

▣ Private Keys Management <br>
Using the export/import functions, you can either transfer private keys between devices using QR Codes, or generate an encrypted backup of your private keys in a text file.

▣ Security Signatures <br>
Security Signatures make sure that no bad actor can abuse the Keys Regeneration feature to impersonate users.
 
▣ Logs <br>
Activity Logs let you keep track of important actions happening across all devices so you could identify actions that weren't yours in the case of a bad actor gaining access to your account.

### Supported Message Types 
▣ Text <br>
▣ Image (coming soon) <br>
▣ Color <br>
This message type allows you to pick a color for the other person to instantly visualize <br>
▣ Location <br>
You can use a built-in interactive map or your device's location to easily share a location to your contacts

### Account Management
Go to the ``/docs`` folder for more details


## How to host it yourself
You'll need (free) accounts for the following services: <br>
▣ Vercel <br>
▣ Firebase <br>
▣ Planet Scale <br>


## Tech Stack

The entire tech stack and architecture is described in-depth in the ``/docs`` folder.

### Backend

Vercel Serverless + Firebase Realtime DB (for real-time communication between users since you can't establish persistent connections to Vercel)

### Frontend

I feel like I'm already profficient with Vue/Nuxt because I used it for more than a year now so I'd really like to have the same level of familiarity with React cuz I enjoy using it just as much and it's also really popular.

### Databases

Details regarding the architecture I chose and why its scalable can be found in the ``/docs`` folder.

Since I already have 3 years of experience working with Mongo DB, I'll try out Planet Scale just for some novelty (also I'd like to get some experience with SQL based DBs). I'll stick to Firebase Realtime DB for storing sessions and any other temporary data.

## Development Method

I'll use a Github project to track everything that needs doing and the progress on every task. Since I'm a big fan of Agile, I'll do the bulk development in sprits spanning a couple of days and use the same method for adding new features later on.

#### I'm planning on adding more features like push notifications, MFA, and possibily audio and video calls, but first I'll be focusing on the basic features above.

