const { SlashCommandBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('piss-on')
        .setDescription('Piss on someone')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Victim')
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('target');

        const avatarURL = user.displayAvatarURL({ extension: 'png', size: 512 });

        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext('2d');

        const avatar = await loadImage(avatarURL);

        // 🌟 secret chance (10%)
        const isSecret = Math.random() < 0.1;

        // choose overlay + messages
        const overlayPath = isSecret
            ? './assets/cum_overlay.png'
            : './assets/piss_overlay.png';

        const overlay = await loadImage(overlayPath);

        // circle avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(256, 256, 256, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(avatar, 0, 0, 512, 512);
        ctx.restore();

        // overlay
        ctx.drawImage(overlay, 0, 0, 512, 512);

        const buffer = canvas.toBuffer();

        // 💬 voicelines
        const normalLines = [
            `${user.username} just got absolutely violated 💀`,
            `bro really got targeted 😭`,
            `clean hit. no escape.`,
            `execution complete.`,
            `${user.username} has been marked.`
        ];

        const secretLines = [
            `⚠️ what… what is that liquid…`,
            `this was *NOT* in the patch notes.`,
            `bro got hit with forbidden fluids ☠️`,
            `*SYSTEM ERROR:* unknown substance detected`,
            `you weren’t supposed to see this.`
        ];

        const msg = isSecret
            ? secretLines[Math.floor(Math.random() * secretLines.length)]
            : normalLines[Math.floor(Math.random() * normalLines.length)];

        await interaction.reply({
            content: msg,
            files: [{
                attachment: buffer,
                name: 'result.png'
            }]
        });
    }
};
