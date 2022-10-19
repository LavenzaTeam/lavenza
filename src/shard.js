const { ShardingManager } = require('discord.js');

if (process.env.branch === "live") {
    var token = process.env.live_branch_token;
} else if (process.env.branch === "test") {
    var token = process.env.test_branch_token;
}

const manager = new ShardingManager('./app.js', { token: token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();