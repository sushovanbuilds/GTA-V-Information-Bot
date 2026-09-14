const token = 'YOUR_DISCORD_TOKEN';
const applicationId = '1549050270842097784';

const commands = [
  {
    name: 'gta-clock',
    description: 'Displays the current in-game time and weather for GTA Online.',
  },
  {
    name: 'gun-van',
    description: 'Instantly fetches the current Gun Van location and stock.',
  },
  {
    name: 'street-dealers',
    description: 'Instantly fetches the current Street Dealers locations.',
  },
  {
    name: 'daily',
    description: 'Instantly fetches all daily updates (Gun Van, Treasure Chests, etc).',
  }
];

async function registerCommands() {
  const response = await fetch(`https://discord.com/api/v10/applications/${applicationId}/commands`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bot ${token}`,
    },
    body: JSON.stringify(commands),
  });

  if (response.ok) {
    console.log('Successfully registered all slash commands!');
  } else {
    console.error('Failed to register commands:', await response.text());
  }
}

registerCommands();
