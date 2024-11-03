const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { verificationEmbed } = require('../embeds/verificationEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Configure the email verification channel and settings.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the verification channel.')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Role to assign after verification')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Provide location information (optional)')
                .setRequired(false)),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');
        const location = interaction.options.getString('location') || 'Not specified';

        if (!channel || channel.type !== ChannelType.GuildText) {
            return interaction.reply({
                content: '❌ The selected channel is invalid or not found. Please try again.',
                ephemeral: true
            });
        }

        interaction.client.verificationConfig = {
            channelId: channel.id,
            roleId: role.id,
            location
        };

        console.log('Verification configuration set:', interaction.client.verificationConfig); // Debugging output

        await channel.send(verificationEmbed(location));

        await interaction.reply({ content: '✅ Verification setup complete!', ephemeral: true });
    }
};