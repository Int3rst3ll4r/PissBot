const { SlashCommandBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('piss_duel')
        .setDescription('Fight someone… in the worst way possible')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Victim')
                .setRequired(true)
        ),

    async execute(interaction) {
        const attackerUser = interaction.user;
        const targetUser = interaction.options.getUser('target');

        const attackerURL = attackerUser.displayAvatarURL({ extension: 'png', size: 256 });
        const targetURL = targetUser.displayAvatarURL({ extension: 'png', size: 256 });

        const canvas = createCanvas(800, 400);
        const ctx = canvas.getContext('2d');

        const attacker = await loadImage(attackerURL);
        const target = await loadImage(targetURL);
        const stream = await loadImage('./assets/piss-stream.png');

        // 🎯 target (bottom right)
        ctx.save();
        ctx.beginPath();
        ctx.arc(600, 200, 100, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(target, 500, 100, 200, 200);
        ctx.restore();

        // 💀 attacker (top left)
        ctx.save();
        ctx.beginPath();
        ctx.arc(200, 200, 100, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(attacker, 100, 100, 200, 200);
        ctx.restore();

        // 💦 stream overlay (connects them visually)
        ctx.drawImage(stream, 0, 0, 800, 400);

        const buffer = canvas.toBuffer();

        await interaction.reply({
            content: `${attackerUser.username} is absolutely violating ${targetUser.username} 💀`,
            files: [{
                attachment: buffer,
                name: 'duel.png'
            }]
        });
    }
};
