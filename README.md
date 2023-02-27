<h1 align="center">Ring Relay</h1>

<p align="center">
  <img src="/src/visual_assets/logof.svg"></img>
</p>


##### Note: this isn't the repo for the app mentioned on my linkedin or resume, this is a refreshed version of the Ring Relay I've built a year ago

## About

A chatting app that lets you see different stats about your texts and conversations such as freqency maps for words, average length of each message and more. I'd love for this app to use a dynamic unique design. I'll also implement end-to-end encryption using a public-private key pair for each user. I'll detail the architecture implemented later on.

## Tech Stack

### Backend

Even if the most efficient back-end solution for this type of real-time app is to use websockets, Heroku removed their free tier so as a result I'm gonna use Vercel Serverless functions as the basis for the backend. Latency should not be noticable after the first messages (I know this from previous experience with SpiderEyes).

### Frontend

I feel like I'm already profficient with Vue because I used it for more than a year now so I'd really like to have the same level of familiarity with React cuz I enjoy using it just as much and it's also really popular.

### Databases

Since I already have 3 years of experience working with Mongo DB, I'll try out PlanetScale just for some novelty (this isn't a techinal driven decision cuz I'll be using this app with friends only anyway)(also I'd like to get some experience with SQL based DBs). I'll stick to Firebase Realtime DB for storing sessions and any other temporary data such as reset password tokens.

## Development Method

I'll use a Github project to track everything that needs doing and the progress on every task. Since I'm a big fan of Agile, I'll do the bulk development in sprits spanning a couple of days and use the same method for adding new features later on.

## Architecture In-Depth

### DB Schema
<p align="center">
  <img src="/docs/Ring Relay Architecture(DB Schema).png"></img>
</p>

The Planet Scale hosted Mysql DB contains 2 main tables (users and refs) that contain all user account data and the relations between how users are connected to eachother. Each user then has its own table that has the name UM`${UID}`. The purpose of this table is to contain all messages sent or received for that specific user, depending on who started the connection. For example, the picture below contains the flowchart of how this new contact process would take place.
