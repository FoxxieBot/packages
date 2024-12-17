import { UserLastFM, UserPlay } from '@prisma/client';
import { container } from '@sapphire/framework';
import { cast, isNullish } from '@sapphire/utilities';
import { firstOrNull, seconds } from '#utils/common';

import { userDiscordIdCacheKey, userLastFmCacheKey } from '../functions/user.js';
import { LastFmRepository } from '../repository/LastFmRepository.js';
import { PlayDataSourceRepository } from '../repository/PlayDataSourceRepository.js';
import { DataSource } from '../types/enums/DataSource.js';
import { ImportUser } from '../types/models/domain/ImportUser.js';
import { TimeSettingsModel } from '../types/models/domain/OptionModels.js';
import { TopArtistList } from '../types/models/domain/TopArtist.js';
import { parseLastFmUserResponse } from '../util/cacheParsers.js';
import { Response } from '../util/Response.js';

export class LastFmDataSourceFactory {
	#lastfmRepository: LastFmRepository;

	#playDataSourceRepository: PlayDataSourceRepository;

	public constructor() {
		this.#lastfmRepository = new LastFmRepository();
		this.#playDataSourceRepository = new PlayDataSourceRepository();
	}

	public async getImportUserForLastFmUserName(lastFmUserName: string) {
		if (!lastFmUserName) return null;

		const user = await this.getUser(lastFmUserName);

		if (user !== null && user.dataSource !== DataSource.LastFm) {
			const lastImportPlay = await container.prisma.$queryRaw<
				Pick<UserPlay, 'timePlayed'>[]
			>`SELECT "timePlayed" FROM public."UserPlay" WHERE "UserPlay"."playSource" != 0 AND "UserPlay"."userId" = ${user.userid}`;

			if (lastImportPlay.length) {
				return cast<ImportUser>({
					dataSource: user.dataSource,
					lastImportPlay: lastImportPlay[0].timePlayed,
					userId: user.userid,
					usernameLastFM: user.usernameLastFM
				});
			}
		}

		return null;
	}

	public async getLfmUserInfo(lastFmUserName: string) {
		const user = await this.#lastfmRepository.getLfmUserInfo(lastFmUserName);
		const importUser = await this.getImportUserForLastFmUserName(lastFmUserName);

		if (importUser !== null && user !== null) {
			return this.#playDataSourceRepository.getLfmUserInfo(importUser, user);
		}

		return user;
	}

	public async getRecentTracks(
		lastFmUserName: string,
		count = 2,
		useCache = false,
		sessionKey = null,
		fromUnixTimestamp: null | number = null,
		amountOfPages = 1
	) {
		const recentTracks = await this.#lastfmRepository.getRecentTracks(
			lastFmUserName,
			count,
			useCache,
			sessionKey,
			fromUnixTimestamp,
			amountOfPages
		);

		const importUser = await this.getImportUserForLastFmUserName(lastFmUserName);

		if (importUser !== null && recentTracks.success && recentTracks.content !== null) {
			const total = await this.#playDataSourceRepository.getScrobbleCountFromDate(importUser, fromUnixTimestamp);

			if (!isNullish(total)) {
				recentTracks.content.totalAmount = total;
			}
		}

		return recentTracks;
	}

	public async getTopArtists(lastFmUserName: string, timeSettings: TimeSettingsModel, count = 2, amountOfPages = 1) {
		const importUser = await this.getImportUserForLastFmUserName(lastFmUserName);

		let topArtists: Response<TopArtistList>;
		if (importUser && timeSettings.startDateTime! <= importUser.lastImportPlay!) {
			topArtists = await this.#playDataSourceRepository.getTopArtists(importUser, timeSettings, count * amountOfPages);

			return topArtists;
		}

		return new Response<TopArtistList>({
			message: 'No import User',
			success: false
		});
	}

	public async getUser(usernameLastFM: string): Promise<null | UserLastFM> {
		const lastFmCacheKey = userLastFmCacheKey(usernameLastFM);

		const cachedValue = parseLastFmUserResponse(await container.redis?.get(lastFmCacheKey));
		if (cachedValue) return cachedValue;

		const executedQuery = await container.prisma.$queryRaw<
			UserLastFM[]
		>`SELECT * FROM public."UserLastFM" WHERE UPPER("UserLastFM"."usernameLastFM") = UPPER(${usernameLastFM}) AND "UserLastFM"."lastUsed" IS NOT NULL ORDER BY "UserLastFM"."lastUsed" DESC LIMIT 1`;

		const user = firstOrNull(executedQuery);

		if (!isNullish(user)) {
			const discordUserIdCacheKey = userDiscordIdCacheKey(user.userid);

			void container.redis?.pinsertex(discordUserIdCacheKey, seconds(5), user);
			void container.redis?.pinsertex(lastFmCacheKey, seconds(5), user);
		}

		return user;
	}
}
