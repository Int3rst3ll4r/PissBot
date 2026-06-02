const { SlashCommandBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('piss-duel')
        .setDescription('Attack someone with questionable substances')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Victim')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const attackerUser = interaction.user;
            const targetUser = interaction.options.getUser('target');

            const canvas = createCanvas(800, 400);
            const ctx = canvas.getContext('2d');

            const attacker = await loadImage(
                attackerUser.displayAvatarURL({ extension: 'png', size: 256 })
            );

            const target = await loadImage(
                targetUser.displayAvatarURL({ extension: 'png', size: 256 })
            );

            // 🎲 SECRET SYSTEM
            const isSecret = Math.random() < 0.1; // 10%

            const type = isSecret ? 'cum' : 'piss';

            const stream = await loadImage(
                path.join(__dirname, `../assets/${type}_stream.png`)
            );

            const overlay = await loadImage(
                path.join(__dirname, `../assets/${type}_overlay.png`)
            );

            // =========================
            // 🧑 ATTACKER
            // =========================
            ctx.save();
            ctx.beginPath();
            ctx.arc(200, 200, 100, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(attacker, 100, 100, 200, 200);
            ctx.restore();

            // =========================
            // 🧍 TARGET (COVERED)
            // =========================
            const x = 520;
            const y = 100;

            ctx.save();
            ctx.beginPath();
            ctx.arc(x + 100, y + 100, 100, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(target, x, y, 200, 200);

            // 💦 covered effect
            ctx.globalAlpha = 0.75;
            ctx.drawImage(overlay, x, y, 200, 200);
            ctx.globalAlpha = 1.0;

            ctx.restore();

            // =========================
            // 💥 STREAM
            // =========================
            ctx.drawImage(stream, 0, 0, 800, 400);

            const buffer = canvas.toBuffer();

            // =========================
            // 💬 VOICELINES
            // =========================
            const normalMsgs = [
                `${attackerUser.username} absolutely drenched ${targetUser.username} 💀`,
                `yellow alert: direct hit`,
                `${targetUser.username} got marked for life 😭`,
                `clean execution.`,
            ];

            const secretMsgs = [
                `🌟 RARE EVENT: forbidden fluid deployed`,
                `⚠️ anomaly detected in payload`,
                `this was NOT supposed to happen...`,
                `${targetUser.username} got hit with THE SECRET 💀`,
                `classified substance used.`,
            ];

            const msgList = isSecret ? secretMsgs : normalMsgs;
            const msg = msgList[Math.floor(Math.random() * msgList.length)];

            await interaction.reply({
                content: msg,
                files: [{
                    attachment: buffer,
                    name: `${type}_duel.png`
                }]
            });

        } catch (err) {
            console.error("DUEL ERROR:", err);

            await interaction.reply({
                content: "something broke 💀",
                ephemeral: true
            });
        }
    }
};
