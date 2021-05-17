const { MessageEmbed, Permissions: { FLAGS }, Role, Emoji, Channel, User } = require('discord.js');
const { emojis: { perms: { granted, notSpecified } }, badges } = require('../../../lib/util/constants')
const moment = require('moment')

module.exports = {
    name: 'info',
	aliases: ['i', 'user', 'whois', 'role', 'channel', 'emoji', 'emote', 'warns', 'warnings', 'notes'],
	usage: 'fox info (role|server|user|channel|emoji)',
	//category: 'utility',
    execute: async (props) => {

        let { lang, message, args, language } = props;

        let user; let emoji;
        channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
        user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.client.users.cache.find(u => u.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member.user;
        let server = message.client.guilds.cache.get(args[1]) || message.guild;
		let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase()); 
        if (args[0]) emoji = message.client.emojis.cache.find((emj) => emj.id === args[0].replace(/^<a?:\w+:(\d+)>$/, '$1'))

		this.perms = {
        ADMINISTRATOR: 'Administrator',
        VIEW_AUDIT_LOG: 'View Audit Log',
        MANAGE_GUILD: 'Manage Server',
        MANAGE_ROLES: 'Manage Roles',
        MANAGE_CHANNELS: 'Manage Channels',
        KICK_MEMBERS: 'Kick Members',
        BAN_MEMBERS: 'Ban Members',
        CREATE_INSTANT_INVITE: 'Create Instant Invite',
        CHANGE_NICKNAME: 'Change Nickname',
        MANAGE_NICKNAMES: 'Manage Nicknames',
        MANAGE_EMOJIS: 'Manage Emojis',
        MANAGE_WEBHOOKS: 'Manage Webhooks',
        VIEW_CHANNEL: 'Read Text Channels and See Voice Channels',
        SEND_MESSAGES: 'Send Messages',
        SEND_TTS_MESSAGES: 'Send TTS Messages',
        MANAGE_MESSAGES: 'Manage Messages',
        EMBED_LINKS: 'Embed Links',
        ATTACH_FILES: 'Attach Files',
        READ_MESSAGE_HISTORY: 'Read Message History',
        MENTION_EVERYONE: 'Mention Everyone',
        USE_EXTERNAL_EMOJIS: 'Use External Emojis',
        ADD_REACTIONS: 'Add Reactions',
        CONNECT: 'Connect',
        SPEAK: 'Speak',
        MUTE_MEMBERS: 'Mute Members',
        DEAFEN_MEMBERS: 'Deafen Members',
        MOVE_MEMBERS: 'Move Members',
        USE_VAD: 'Use Voice Activity',
        STREAM: 'Go Live',
        ROLE: 'testing role thing'
    }
        this.regions = {
            'eu-central': 'Central Europe',
            india: 'India',
            london: 'London',
            japan: 'Japan',
            amsterdam: 'Amsterdam',
            brazil: 'Brazil',
            'us-west': 'US West',
            hongkong: 'Hong Kong',
            southafrica: 'South Africa',
            sydney: 'Sydney',
            europe: 'Europe',
            singapore: 'Singapore',
            'us-central': 'US Central',
            'eu-west': 'Western Europe',
            dubai: 'Dubai',
            'us-south': 'US South',
            'us-east': 'US East',
            frankfurt: 'Frankfurt',
            russia: 'Russia'
        }
        this.verificationLevels = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: '(╯°□°）╯︵ ┻━┻',
            VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
        }
        this.filterLevels = {
            DISABLED: "Don't scan any messages",
            MEMBERS_WITHOUT_ROLES: 'Scan messages from members without a role',
            ALL_MEMBERS: 'Scan messages by all members'
        }

        if (channel instanceof Channel) return channelInfo();
        if (emoji instanceof Emoji) return emojiinfo();
        if (role instanceof Role) return roleinfo(this.perms);
        if (message.guild && args[0] === 'server') return serverinfo(this.regions, this.verificationLevels, this.filterLevels);
		if (message.guild && args[0] === message.guild.id) serverinfo(this.regions, this.verificationLevels, this.filterLevels);
        if (user instanceof User && args[0] !== 'server' && user) return userinfo();

        async function userinfo(){

            const loading = await language.send("MESSAGE_LOADING", lang);
            let embed = new MessageEmbed();
            embed = await _addBaseData(embed);
            embed = await _addBadges(embed);
            embed = await _addMemberData(embed);
            await loading.delete();
            return message.channel.send(embed)
        }

        async function _addBaseData(embed) {
            return embed
                .setTitle(`${user.tag} (ID: ${user.id})`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        }

        async function _addBadges(embed) {
            const bitfield = await user.settings.get('badges')
            const out = badges.filter((_, idx) => bitfield & (1 << idx)); /* eslint-disable-line no-bitwise */
            if (!out.length) return embed;

            return embed.setDescription(out.map(badge => `${badge.icon} ${badge.name}`).join('\n'));
        }

        async function _addMemberData(embed) {
            const member = message.guild ? await message.guild.members.fetch(user).catch(() => null) : null;
		    const creator = member && (member.joinedTimestamp - message.guild.createdTimestamp) < 3000;

            const statistics = [
                language.get('COMMAND_INFO_USER_DISCORDJOIN', lang, moment(user.createdAt).format('MMMM Do YYYY'), moment([moment(user.createdAt).format('YYYY'), moment(user.createdAt).format('M') - 1, moment(user.createdAt).format('D')]).toNow(true))
            ];

            if (member) {

                let join = [message.guild.name,
                    moment(member.joinedAt).format('MMMM Do YYYY'),
                    moment([moment(member.joinedAt).format('YYYY'), moment(member.joinedAt).format('M') - 1, moment(member.joinedAt).format('D')]).toNow(true)]

                statistics.push(creator ? language.get('COMMAND_INFO_USER_GUILDCREATE', lang, join) 
                                : language.get('COMMAND_INFO_USER_GUILDJOIN', lang, join)
                );
            
                let personal = []

                const birthday = null;
		        if (birthday) {
			        statistics.push(language.get('COMMAND_INFO_USER_BIRTHDAY', lang, birthday));
		        }

                let msgs = await member.user.settings.get(`servers.${message.guild.id}.messageCount`)
                statistics.push(language.get('COMMAND_USER_MESSAGES_SENT', lang, msgs || 0));

                let totalStar = await member.user.settings.get(`servers.${message.guild.id}.starCount`);
                let minimum = await message.guild.settings.get(`starboard.minimum`) || 3;
		        if (totalStar && totalStar >= minimum) {
			        statistics.push(language.get('COMMAND_INFO_USER_STARS_EARNED', lang, totalStar));
		        }

                // const birthday = '08-29'//null;
		        // if (birthday) {
			    //     statistics.push(language.get('COMMAND_INFO_USER_BIRTHDAY', lang, birthday));
		        // }

                statistics.push(personal.join(" "))
            }

            embed.addField(`:pencil: ${language.get('COMMAND_INFO_USER_STATISTICS', lang)}`, statistics.join('\n'));
		    if (!member) return embed.setColor(message.guild.me.displayColor)

            const roles = member.roles.cache.sorted((a, b) => b.position - a.position);
            let spacer = false;
            const roleString = roles
                .array()
                .filter(role => role.id !== message.guild.id)
                .reduce((acc, role, idx) => {
                    if (acc.length + role.name.length < 1010) {
                        if (role.name === '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯') {
                            spacer = true;
                            return `${acc}\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n`;
                        } else {
                            const comma = (idx !== 0) && !spacer ? ', ' : '';
                            spacer = false;
                            return acc + comma + role.name;
                        }
                    } else { return acc; }
                }, '')

            if (roles.size) {
                embed.addField(
                    `:scroll: ${language.get('COMMAND_INFO_USER_ROLES', lang, roles.size)}`,
                    roleString.length ? roleString : language.get('COMMAND_INFO_USER_NOROLES', lang)
                )
            }

            let warnings = await member.user.settings.get(`servers.${message.guild.id}.warnings`)
		    if (warnings?.length) {
			    for (const { author } of warnings) await message.client.users.fetch(author);
			    embed.addField(
				    `:lock: ${language.get('COMMAND_INFO_USER_WARNINGS', lang, warnings)}`,
				    warnings.map((warn, idx) => `${idx + 1}. ${warn.active ? '~~' : ''}${warn.reason} - **${message.client.users.cache.get(warn.author).tag}**${warn.active ? '~~' : ''}`)
			    );
		    }

            const notes = await member.user.settings.get(`servers.${message.guild.id}.notes`)
		    if (notes?.length) {
			    for (const { author } of notes) await message.client.users.fetch(author);
			    embed.addField(
				    `:label: ${language.get('COMMAND_INFO_USER_NOTES', lang, notes)}`,
				    notes.map((note, idx) => `${idx + 1}. ${note.reason} - **${message.client.users.cache.get(note.author).tag}**`)
			    );
		    }
            return embed.setColor(member.displayColor)
        }

        async function emojiinfo() {

            let embed = new MessageEmbed()
                .setTitle(`${emoji.name} (ID: ${emoji.id})`)
                .setDescription(`The **${emoji.name}** emote was created ${moment(emoji.createdTimestamp).format('MMMM Do YYYY')} **(${moment([moment(emoji.createdTimestamp).format('YYYY'), moment(emoji.createdTimestamp).format('M') - 1, moment(emoji.createdTimestamp).format('D')]).toNow(true)} ${lang.COMMAND_ROLE_CREATED_AGO})**`)
                .setColor(message.guild.me.displayColor)
                .setImage(emoji.url)
                .addField(`:pencil2: **Name**`, emoji.name, true)
                .addField(`:projector: **Animated**`, `${emoji.animated?'Yes':'No'}`, true)
                .addField(':link: **Image Links**', `${emoji.animated
                    ? `[PNG](${emoji.url.replace('.gif', '.png')}) | [JPEG](${emoji.url.replace('.gif', '.jpg')}) | [GIF](${emoji.url})`
                    :`[PNG](${emoji.url}) | [JPEG](${emoji.url.replace('.png', '.jpeg')})`}`, true)

            return message.channel.send(embed)
        }

        async function channelInfo() {

            const embed = new MessageEmbed()
                .setTitle(`${channel.name} (ID: ${channel.id})`)
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true }))
                .setDescription(`${channel.name} was created ${moment(channel.createdAt).format('MMMM Do YYYY')} **(${moment([moment(channel.createdAt).format('YYYY'), moment(channel.createdAt).format('M') - 1, moment(channel.createdAt).format('D')]).toNow(true)} ago)**`)

            channel.type === 'text'
            ? embed.addField(`**Channel Topic**`, channel.topic
            ? channel.topic : 'No channel topic is set for this channel') : ''

            embed.addField(':dividers: **Type**', channel.type, true)
                .addField(':scroll: **Category**', `${channel.parent?channel.parent.name:'None'}`, true)
                .addField('\u200B', '\u200B', true)

            channel.type === 'text' || channel.type === 'news'
            ? embed.addField(':underage: **NSFW**', channel.nsfw
            ?'Yes':'No', true) : ''

            channel.type === 'voice'
            ? embed.addField(':busts_in_silhouette: **User Limit**', channel.userLimit === 0
            ? 'Infinite' : channel.userLimit, true) : ''

            channel.type === 'text' || channel.type === 'news'
            ? embed.addField(':alarm_clock: **Chat Cooldown**', channel.rateLimitPerUser == 0 || channel.rateLimitPerUser == null
            ? 'None' : `${channel.rateLimitPerUser} Seconds`, true) : ''

            channel.type === 'voice'
            ? embed.addField(':satellite: **Bit Rate**', `${channel.bitrate/1000} KB/s`, true) : ''

            channel.type === 'text' || channel.type === 'news'
            ? embed.addField('\u200B', '\u200B', true) : ''

            channel.type === 'voice'
            ? embed.addField('\u200B', '\u200B', true) : ''

            return message.channel.send(embed)
        }

        async function roleinfo(perms){
            const [bots, humans] = role.members.partition(member => member.user.bot);

            const embed = new MessageEmbed()
                .setTitle(`${role.name} (ID: ${role.id})`)
                .setColor(role.color)
                .addField(`:art: ${lang.COMMAND_ROLE_COLOR}`, role.color ? role.hexColor : lang.COMMAND_ROLE_NOCOLOR, true)
                .addField(`:people_hugging: ${lang.COMMAND_ROLE_MEMBERS}`, `${humans.size} ${lang.COMMAND_ROLE_USER}${humans.size === 1 ? '' : lang.COMMAND_ROLE_PLURAL}, ${bots.size} ${lang.COMMAND_ROLE_BOTS}${bots.size === 1 ? '' : lang.COMMAND_ROLE_PLURAL}`, true)
                .addField(`:hammer: ${lang.COMMAND_ROLE_PERMISSIONS}`, role.permissions.has(FLAGS.ADMINISTRATOR)
                    ? lang.COMMAND_ROLE_ALLPERMS
                    : Object.entries(role.permissions.serialize()).filter(perm => perm[1]).map(([perm]) => perms[perm]).join(', ') || lang.COMMAND_ROLE_NOCOLOR, true)
                .addField(`:calendar: ${lang.COMMAND_ROLE_CREATED}`, `${moment(role.createdAt).format('MMMM Do YYYY')} **(${moment([moment(role.createdAt).format('YYYY'), moment(role.createdAt).format('M') - 1, moment(role.createdAt).format('D')]).toNow(true)} ${lang.COMMAND_ROLE_CREATED_AGO})**`, true)
                .addField(`:bookmark_tabs: ${lang.COMMAND_ROLE_PROPERTIES}`, [
                    role.hoist
                        ? `${granted} ${lang.COMMAND_ROLE_SEPERATE}`
                        : `${notSpecified} ${lang.COMMAND_ROLE_NOTSEPERATE}`,
                    role.mentionable
                        ? `${granted} ${lang.COMMAND_ROLE_MENTIONABLE} ${role.toString()}`
                        : `${notSpecified} ${lang.COMMAND_ROLE_NOT_MENTIONABLE}`,
                    !role.managed
                        ? `${granted} ${lang.COMMAND_ROLE_CONFIGURABLE}`
                        : `${notSpecified} ${lang.COMMAND_ROLE_INTEGRATION}`
                ].join('\n'));

            return message.channel.send(embed)
        }

        async function serverinfo(region, veri, filter) {
            let messageCount = await server.settings.get('messageCount');
                    
            let messages = 0
            if (messageCount) messages = messageCount;
            const guild = server;
            const toxicity = 0

            await message.guild.members.fetch(message.guild.ownerID);

            const embed = new MessageEmbed()
                .setTitle(`${guild.name} (ID: ${guild.id})`)
                .setDescription(`Created by **${guild.owner.user.tag}** on ${moment(guild.createdAt).format('MMMM Do YYYY')} **(${moment([moment(guild.createdAt).format('YYYY'), moment(guild.createdAt).format('M') - 1, moment(guild.createdAt).format('D')]).toNow(true)} ago)**`)
                .addField(':crown: **Owner**', guild.owner.user.tag, true)
                .addField(':busts_in_silhouette: **Members**', `${guild.memberCount} (cached: ${guild.members.cache.size})`, true)
                .addField(`:speech_balloon: **Channels (${guild.channels.cache.size})**`, guild.channels.cache.size>0?`Text: **${guild.channels.cache.filter(c => c.type === "text").size}**\nVoice: **${guild.channels.cache.filter(c => c.type === "voice").size}**`:'None', true)
                .addField(':map: **Region**', region[guild.region], true)
                .addField(`:scroll: **Roles**`, guild.roles.cache.size > 0 ? guild.roles.cache.size : 'None', true)
                .addField(':sunglasses: **Emojis**', guild.emojis.cache.size > 0 ? guild.emojis.cache.size : 'None', true)
                .addField(':bar_chart: **Statistics**', `${messages.toLocaleString()} messages ${toxicity !== 0 ? `with an average toxicity of ${Math.round(toxicity * 100)}%` : ''} sent`)
                .addField(':lock: **Security**', [
                    `Verification level: ${veri[message.guild.verificationLevel]}`,
                    `Explicit filter: ${filter[message.guild.explicitContentFilter]}`
                ].join('\n'));

            embed.setThumbnail(guild.iconURL({ format: 'png', dynamic: true }))
            embed.setColor(message.guild.me.displayColor)
            return message.channel.send(embed);
        }
    }
}