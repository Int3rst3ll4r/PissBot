const { SlashCommandBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pfp-circle')
        .setDescription('Get circular pfp')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User')
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const avatarURL = user.displayAvatarURL({ extension: 'png', size: 512 });

        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext('2d');

        const avatar = await loadImage(avatarURL);

        ctx.save();
        ctx.beginPath();
        ctx.arc(256, 256, 256, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(avatar, 0, 0, 512, 512);
        ctx.restore();

        const buffer = canvas.toBuffer();

        await interaction.reply({
            files: [{ attachment: buffer, name: 'pfp-circle.png' }]
        });
    }
};
