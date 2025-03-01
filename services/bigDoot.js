const { playFile, connectToChannel, createPlayer } = require('./voiceManager');

module.exports = {
    bigDoot: (client) => {
        console.log('\n---Big Doot Incoming---');
        var voiceChannels = [];
        const player = createPlayer();
        
        client.channels.cache.forEach((channel) => {
            if (channel.isVoice() && channel.members.size > 0) {
                voiceChannels.push(channel);
            }
        });
        console.log(`Hitting ${voiceChannels.length} channels`);
        
        voiceChannels.forEach(async (channel) => {
            var permissions = channel.permissionsFor(client.user);
            if (permissions.has('CONNECT') && permissions.has('SPEAK')) {
                console.log(`dooting ${channel.members.size} nerd(s)`);
                try {
                    // setup audio player
                    await playFile(player);
    
                    // join voice channel and play audio file
                    const connection = await connectToChannel(channel);
                    connection.subscribe(player);
                    player.on('stateChange', (oldState, newState) => {
                        if (newState.status === 'idle') connection.destroy();
                    });
                } catch (err) {
                    console.error(err);
                }
            } else {
                console.log('lack permissions to join channel :(');
            }
        });
        console.log('---Doots Doot Dooted---\n');
    }
}