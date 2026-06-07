const mineflayer = require('mineflayer');

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

function createBot() {
    const bot = mineflayer.createBot({
        host: 'dreamsmpbutbroke.falixsrv.me',
        port: 29014,
        username: 'AFKBot',
        auth: 'offline',
        version: false
    });

    let homePosition = null;

    bot.on('login', () => {
        console.log('Logged in');
    });

    bot.once('spawn', () => {
        console.log('Bot joined successfully!');

        homePosition = bot.entity.position.clone();

        console.log(
            `Home position set to X:${homePosition.x.toFixed(1)} Y:${homePosition.y.toFixed(1)} Z:${homePosition.z.toFixed(1)}`
        );

        // Heartbeat
        setInterval(() => {
            const mem = process.memoryUsage();

            console.log(
                `Alive | RAM: ${(mem.rss / 1024 / 1024).toFixed(1)} MB`
            );
        }, 60000);

        // Anti-AFK every 3 minutes
        setInterval(() => {

            const actions = [
                'left',
                'right',
                'jump'
            ];

            const action =
                actions[Math.floor(Math.random() * actions.length)];

            console.log(`Performing anti-AFK action: ${action}`);

            // Random head rotation
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * 0.5;

            bot.look(yaw, pitch, true);

            if (action === 'jump') {
                bot.setControlState('jump', true);

                setTimeout(() => {
                    bot.setControlState('jump', false);
                }, 1000);
            } else {
                bot.setControlState(action, true);

                setTimeout(() => {
                    bot.setControlState(action, false);
                }, 1500);
            }

        }, 180000);

        // Return to original position every 10-15 minutes
        function scheduleReturnHome() {

            const delay =
                (10 + Math.random() * 5) * 60 * 1000;

            setTimeout(() => {

                if (homePosition) {

                    console.log('Returning to home position...');

                    // If EssentialsX is installed and you have set a home:
                    // bot.chat('/home afk');

                    // Otherwise use teleport command
                    bot.chat(
                        `/tp ${homePosition.x.toFixed(1)} ${homePosition.y.toFixed(1)} ${homePosition.z.toFixed(1)}`
                    );
                }

                scheduleReturnHome();

            }, delay);
        }

        scheduleReturnHome();
    });

    bot.on('kicked', (reason) => {
        console.log('Kicked:', reason);
    });

    bot.on('error', (err) => {
        console.error('Error:', err);
    });

    bot.on('end', () => {
        console.log('Disconnected. Reconnecting in 10 seconds...');
        setTimeout(createBot, 10000);
    });
}

createBot();