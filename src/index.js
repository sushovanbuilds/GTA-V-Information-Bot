import { Router } from 'itty-router';
import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';

import collectables from './modules/collectables.js';
import madrazo_hits from './modules/madrazo_hits.js';
import exotic_exports from './modules/exotic_exports.js';
import street_dealers from './modules/street_dealers.js';
import gun_van from './modules/gun_van.js';
import time_trials from './modules/time_trials.js';
import clock from './modules/clock.js';
import tunables from './util/tunables.js';

// Discord Bot Configuration
const BOT_TOKEN = 'YOUR_DISCORD_TOKEN';
const CHANNEL_ID = '1548916169476407348';
const PUBLIC_KEY = 'aed77955813ec3d36cf93e0b78c68a2e033604526c8e8a94634ce5004dae402e';
const ASSETS_BASE_URL = 'https://raw.githubusercontent.com/ShinyWasabi/GTAO-Bot/main/src/assets';

function create_embed_payload(title, description, image_file, color) {
    return {
        title: title,
        description: description,
        color: color,
        thumbnail: { url: `${ASSETS_BASE_URL}/${image_file}.png` }
    };
}

async function send_channel_message(embeds) {
    const response = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${BOT_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ embeds })
    });
    if (!response.ok) {
        console.error('Failed to send message:', await response.text());
    }
}

async function run_daily_job() {
    await tunables.download_tunables();
    
    const embeds = [
        create_embed_payload('Treasure Chests', 'The new Treasure Chest locations are now available!\n\n' + collectables.create_treasure_chest_message(), 'treasure', 0xEEEEE4),
        create_embed_payload('Hidden Caches', 'The new Hidden Cache locations are now available!\n\n' + collectables.create_hidden_cache_message(), 'cache', 0xEEEEE4),
        create_embed_payload('Shipwreck', 'The new Shipwreck location is now available!\n\n' + collectables.create_shipwrecked_message(), 'shipwrecked', 0xEEEEE4),
        create_embed_payload('Buried Stashes', 'The new Buried Stash locations are now available!\n\n' + collectables.create_buried_stash_message(), 'shipwrecked', 0xEEEEE4),
        create_embed_payload('Junk Energy Skydives', 'The new Junk Energy Skydive locations are now available!\n\n' + collectables.create_skydive_message(), 'skydive', 0xEEEEE4),
        create_embed_payload('LS Tags', 'The new LS Tag locations are now available!\n\n' + collectables.create_ls_tag_message(), 'tag', 0xEEEEE4),
        create_embed_payload('Madrazo Hits', 'The new Madrazo Hit location is now available!\n\n' + madrazo_hits.create_madrazo_hit_message(), 'hit', 0x6338E8),
        create_embed_payload('Exotic Exports', 'The new Exotic Exports vehicle list is now available!\n\n' + exotic_exports.create_exotic_exports_message(), 'exotic', 0x045CC6),
        create_embed_payload('Street Dealers', 'The new Street Dealers locations & stock are now available!\n\n' + street_dealers.create_street_dealers_message(), 'dealer', 0x760485),
        create_embed_payload('Gun Van', 'The new Gun Van location is now available!\n\n' + gun_van.create_gun_van_message(), 'van', 0x070607),
        create_embed_payload('RC Bandito Time Trial', 'The new RC Bandito Time Trial location is now available!\n\n' + time_trials.create_rc_time_trial_message(), 'rctt', 0x6338E8),
        create_embed_payload('Junk Energy Bike Time Trial', 'The new Junk Energy Bike Time Trial location is now available!\n\n' + time_trials.create_bike_time_trial_message(), 'btt', 0x6338E8)
    ];

    await send_channel_message(embeds.slice(0, 10));
    await send_channel_message(embeds.slice(10));
}

export default {
    async fetch(request, env, ctx) {
        if (request.method === 'GET') {
            return new Response('GTA V Bot Worker is running!', { status: 200 });
        }

        if (request.method === 'POST') {
            const signature = request.headers.get('x-signature-ed25519');
            const timestamp = request.headers.get('x-signature-timestamp');
            const body = await request.clone().text();

            if (!signature || !timestamp) return new Response('Missing signature', { status: 401 });

            let isValid = false;
            try {
                isValid = await verifyKey(body, signature, timestamp, PUBLIC_KEY);
            } catch (err) {
                console.error('VerifyKey Error:', err);
                return new Response('Verification error', { status: 500 });
            }

            if (!isValid) return new Response('Bad request signature', { status: 401 });

            const interaction = await request.json();

            if (interaction.type === InteractionType.PING) {
                return new Response(JSON.stringify({ type: InteractionResponseType.PONG }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            if (interaction.type === InteractionType.APPLICATION_COMMAND) {
                const commandName = interaction.data.name;
                await tunables.download_tunables();

                if (commandName === 'gta-clock') {
                    return new Response(JSON.stringify({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            embeds: [{
                                title: 'GTA Online Clock',
                                color: 0xEEEEE4,
                                fields: [
                                    { name: ':alarm_clock: Time', value: `${clock.get_weekday()}, ${clock.get_hour_and_minute()}` },
                                    { name: ':sunny: Weather', value: `${clock.get_weather()}` }
                                ]
                            }]
                        }
                    }), { headers: { 'Content-Type': 'application/json' } });
                } else if (commandName === 'gun-van') {
                    return new Response(JSON.stringify({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: { embeds: [create_embed_payload('Gun Van', 'The current Gun Van location & stock:\n\n' + gun_van.create_gun_van_message(), 'van', 0x070607)] }
                    }), { headers: { 'Content-Type': 'application/json' } });
                } else if (commandName === 'street-dealers') {
                    return new Response(JSON.stringify({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: { embeds: [create_embed_payload('Street Dealers', 'The current Street Dealers locations & stock:\n\n' + street_dealers.create_street_dealers_message(), 'dealer', 0x760485)] }
                    }), { headers: { 'Content-Type': 'application/json' } });
                } else if (commandName === 'daily') {
                    ctx.waitUntil(run_daily_job());
                    return new Response(JSON.stringify({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: { content: 'Fetching all daily updates in the background...' }
                    }), { headers: { 'Content-Type': 'application/json' } });
                }
            }

            return new Response('Unknown interaction type', { status: 400 });
        }

        return new Response('Not found', { status: 404 });
    },
    async scheduled(event, env, ctx) {
        ctx.waitUntil(run_daily_job());
    }
};
