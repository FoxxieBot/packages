import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand, ModerationSetupRestriction } from '#lib/structures';
import { ModerationRoleCommand } from '#lib/structures/moderation/ModerationRoleCommand';
import { getModeration } from '#utils/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { ArgumentTypes } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@ApplyOptions<ModerationRoleCommand.Options>({
    aliases: ['ure', 'un-restrict-embed'],
    duration: false,
    requiredClientPermissions: [PermissionFlagsBits.ManageRoles],
    memberOnly: true,
    options: ['reference'],
    description: LanguageKeys.Commands.Moderation.UnRestrictEmbedDescription,
    successKey: LanguageKeys.Commands.Moderation.UnRestrictEmbedSuccess,
    roleKey: GuildSettings.Roles.EmbedRestrict,
    setUpKey: ModerationSetupRestriction.Embed
})
export class UserCommand extends ModerationRoleCommand {
    public async handle(...[message, context]: ArgumentTypes<ModerationCommand['handle']>) {
        return getModeration(message.guild).actions.unRestrictEmbed(
            {
                userId: context.target.id,
                moderatorId: message.author.id,
                reason: context.reason,
                guildId: message.guild.id,
                refrence: context.args.getOption('reference') ? Number(context.args.getOption('reference')) : null
            },
            await this.getDmData(message, context)
        );
    }
}