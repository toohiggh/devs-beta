// buttons/enterEmail.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { validateEmail, sendOtpEmail, ALLOWED_DOMAINS } = require('../utils/emailService');
const { generateOtp } = require('../utils/otpGenerator');

module.exports = {
    customID: 'enterEmail',

    async execute(interaction) {
        const emailModal = new ModalBuilder()
            .setCustomId('emailModal')
            .setTitle('Enter Your Email');

        const emailInput = new TextInputBuilder()
            .setCustomId('emailInput')
            .setLabel('Email Address')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('example@gmail.com')
            .setRequired(true)
            .setMinLength(5)
            .setMaxLength(320);

        emailModal.addComponents(new ActionRowBuilder().addComponents(emailInput));
        await interaction.showModal(emailModal);
    },

    async handleModal(interaction) {
        try {
            const email = interaction.fields.getTextInputValue('emailInput').trim().toLowerCase();

            const validation = validateEmail(email);
            if (!validation.valid) {
                const errorMessages = {
                    FORMAT: 'Please enter a valid email address (e.g., example@gmail.com).',
                    DOMAIN: `Please use one of these email providers: ${ALLOWED_DOMAINS.join(', ')}`
                };

                await interaction.reply({
                    content: errorMessages[validation.reason],
                    ephemeral: true
                });
                return;
            }

            await interaction.deferReply({ ephemeral: true });

            const otp = generateOtp(interaction.user.id);
            console.log(`Generated OTP for ${interaction.user.id}: ${otp} (expires in 2 minutes)`);

            try {
                await sendOtpEmail(email, otp);
                await interaction.editReply({
                    content: '✅ OTP has been sent to your email. Please check your inbox and use "Verify OTP" to continue.'
                });
            } catch (error) {
                console.error('Failed to send email:', error);
                const errorMessage = error.message === 'SMTP_ERROR' 
                    ? 'Failed to send email. Please try again later.'
                    : 'An error occurred. Please try again.';
                
                await interaction.editReply({
                    content: `❌ ${errorMessage}`
                });
            }
        } catch (error) {
            console.error('Error in email verification:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ An error occurred. Please try again later.',
                    ephemeral: true
                });
            } else if (interaction.deferred) {
                await interaction.editReply({
                    content: '❌ An error occurred. Please try again later.'
                });
            }
        }
    }
};