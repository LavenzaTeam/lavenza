const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./app.js', { token: process.env.token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();