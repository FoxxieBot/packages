import { GuildMember, PermissionFlagsBits } from 'discord.js';

export function isAdmin(member: GuildMember | undefined): boolean {
	if (!member) return false;
	return isGuildOwner(member) || member.permissions.has(PermissionFlagsBits.ManageGuild);
}

export function isGuildOwner(member: GuildMember): boolean {
	return member.id === member.guild.ownerId;
}

export function isModerator(member: GuildMember | undefined): boolean {
	if (!member) return false;
	return (
		isGuildOwner(member) || member.permissions.has(PermissionFlagsBits.BanMembers) || member.permissions.has(PermissionFlagsBits.ModerateMembers)
	);
}
