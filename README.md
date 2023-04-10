<h1 align="center">Ring Relay</h1>

<p align="center">
  <img src="src/visual_assets/logoMin.svg"></img>
</p>

## Status
```diff
+ Front-end required for the initial release completed [This repo]
+ Back-end required for the initial release completed [Ring-Relay-API-Prod] +
```

## Documentation
There is a document in the ``/docs`` folder that contains an in-depth dive into how this app works, how to use it, and more. <br>
Click the link below to download it directly. <br>
[Ring-Relay Documentation](https://github.com/undefined1raven/Ring-Relay/raw/main/docs/Ring-Relay%20Documentation.pdf)

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

### Prerequisites
You'll need (free) accounts for the following services: <br>
▣ Node JS and NPM installed on your machine (if you get any version incompatibility errors use the n pkg (``npm install -g n``) to modify the Node version) <br>
▣ Vercel <br>
▣ Firebase <br>
▣ Planet Scale <br>
▣ Github <br>
▣ One Signal (optional for notifications. if you dont want to create an account for this make sure to delete the code related to sending notifications in the back-end) <br>

### Steps 
1. Clone this repo to your machine <br>
2. Run ``npm i`` to install dependancies (you might have to use the -f flag too) <br>
3. Build the app for local dev with ``npm start`` <br>
4. Once the front-end is up and running, clone the back-end from the ``Ring-Relay-API-Prod`` repo <br>
5. Install the Vercel CLI with ``npm i -g vercel`` <br>
6. Run ``npm i && vercel dev`` at the root of the back-end folder to run it locally (you might have to log in) <br>
7. Use a global seach function in the front-end folder (CTRL+Shift+F in VS Code) to replace all strings matching ``prodx`` with ``devx`` (this tells the front-end to use the local back-end) (its important not to skip this since the CORS policy will prevent you from using the production back-end from localhost) <br>
8. Make sure the if statements present in the function at ``src/fn/DomainGetter.js`` are working properly (ENV_TYPE == 'devx' to return the localhost API url and the other one the production url) <br>
9. Create two Github repos one for the back-end and one for the front-end <br>
10. Link the repos to Vercel (each should have its own app) <br>
11. Search the two files (``dbop.js`` and ``auth.js``) containing the back-end for ``process.env`` to find all env variables you'll have to add to Vercel <br>
12. Use your Firebase accont to create a new app for the Realtime Database and copy the credentials from ``Project Overview -> Project Settings -> Your apps -> SDK setup and configuration`` to a Vercel env variable named ``FIREBASE_SCA`` <br>
13. Replace the ``initializeApp`` function args with the credential and/or databaseURL from your Firebase Project (this applies for both front-end and back-end since both interface with Firebase) <br>
14. Use Planet Scale's Node JS setup to get the Database Key. Copy that into an env variable named ``DB_KEY`` in Vercel <br>
15. Use Planet Scale's Console to create the ``Users``, ``refs``, and ``Logs`` tables with the schemas detailed in the ``/docs`` folder <br>
16. At this point all the the config is done, but considering the complexity of the process, you'll probably have to do some debugging. The back-end code is properly protected against crashes so you might want to comment out catches so you would get some info about what happened in the console. Using the dev tool's network tab makes this easier. For any issues, feel free to create a new issue describing what isn't working as expected. 

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

I'll use a Github project to track everything that needs doing and the progress on every task.

## Future Features
See the Features Project for features that will be added and their status. Feel free to create new Issues with the ``feature`` tag to recommend any new features. 

