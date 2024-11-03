// embeds/verificationEmbed.js
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

const verificationEmbed = (location = 'Not specified') => {
    const embed = new EmbedBuilder()
        .setTitle('Email Verification')
        .setDescription('To verify your email, please use the buttons below:')
        .addFields(
            { name: 'Location', value: location, inline: true }
        )
        .setColor(0x3498db)
        .setFooter({ text: 'If you encounter any issues, please reach out for support.' });

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('enterEmail')
                .setLabel('Enter Email')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('verifyOTP')
                .setLabel('Verify OTP')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('support')
                .setLabel('Support')
                .setStyle(ButtonStyle.Secondary)
        );

    return { embeds: [embed], components: [row] };
};

module.exports = { verificationEmbed };