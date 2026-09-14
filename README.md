# GTA V Information Bot

A Discord bot for GTA Online that allows you to locate Daily Collectibles, Gun Van, Street Dealers, and more.
This bot is designed to run as a **Cloudflare Worker** and uses Discord Interactions (slash commands) and cron triggers to send daily reset information.

## Features

Sends messages to specified channels at the daily reset time (6 AM UTC) for:
* Treasure Chests
* Hidden Caches
* Shipwreck
* Buried Stashes
* Junk Energy Skydives
* LS Tags
* Madrazo Hits
* Exotic Exports (Vehicle List)
* Street Dealers (Locations & Stock)
* Gun Van (Location & Stock)
* RC Bandito Time Trial
* Junk Energy Bike Time Trial

It also provides commands like `!gta-clock` to get the current in-game time and weather.

## Setup & Deployment (Cloudflare Workers)

This project uses [Wrangler](https://developers.cloudflare.com/workers/wrangler/) to deploy to Cloudflare Workers.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
You will need to set up your Discord Application secrets and environment variables in Cloudflare. Required secrets typically include:
- `DISCORD_TOKEN`
- `DISCORD_PUBLIC_KEY`
- `DISCORD_APPLICATION_ID`

You can add these secrets using Wrangler:
```bash
npx wrangler secret put DISCORD_TOKEN
```

### 3. Register Slash Commands
Run the register script to register your Discord slash commands:
```bash
node register.js
```

### 4. Deploy to Cloudflare Workers
Deploy the bot to your Cloudflare account:
```bash
npx wrangler deploy
```

## Credits
* [gir489returns](https://github.com/gir489returns) (network_seed_random_number_generator implementation)
* [Senexis](https://github.com/Senexis) (decrypted tunables)
* [PLTytus](https://github.com/PLTytus) (weather map)