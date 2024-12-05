import { ModerationManager } from '#lib/moderation';
import { FoxxieEvents } from '#lib/types';
import { JSONEmbed } from '#root/commands/Misc/reminder';
import { BirthdayData } from '#utils/birthday';
import { SchemaKeys, TypeVariation } from '#utils/moderation';
import { schedule } from '@prisma/client';
import { container } from '@sapphire/framework';
import { Cron } from '@sapphire/time-utilities';
import { isNullishOrEmpty } from '@sapphire/utilities';

export class ScheduleEntry<Type extends ScheduleEntry.TaskId = ScheduleEntry.TaskId> {
	public id: number;
	public taskId: ScheduleEntry.TaskId;
	public time!: Date;
	public recurring!: Cron | null;
	public catchUp!: boolean;
	public data!: ScheduleEntry.TaskData[Type];

	#running = false;

	#paused = false;

	public constructor(data: schedule) {
		this.id = data.id;
		this.taskId = data.taskId as ScheduleEntry.TaskId;
		this.#patch(data);
	}

	public get task() {
		return container.stores.get('tasks').get(this.taskId) ?? null;
	}

	public get running(): boolean {
		return this.#running;
	}

	public resume() {
		this.#paused = false;
		return this;
	}

	public pause() {
		this.#paused = true;
		return this;
	}

	public reschedule(time: Date | number) {
		return container.schedule.reschedule(this, time);
	}

	public delete() {
		return container.schedule.remove(this);
	}

	public async run(): Promise<ResponseValue> {
		const { task } = this;
		if (!task?.enabled || this.#running || this.#paused) return { entry: this, type: ResponseType.Ignore };

		this.#running = true;
		let response: PartialResponseValue | null = null;
		try {
			response = (await task.run({ ...(this.data ?? {}), id: this.id })) as PartialResponseValue | null;
		} catch (error) {
			container.client.emit(FoxxieEvents.TaskError, error, { piece: task, entity: this });
		}

		this.#running = false;

		if (response !== null) return { ...response, entry: this };

		return this.recurring
			? { entry: this, type: ResponseType.Update, value: this.recurring.next() }
			: { entry: this, type: ResponseType.Finished };
	}

	public async update(data: ScheduleEntry.UpdateData<Type>) {
		const entry = await container.prisma.schedule.update({
			where: { id: this.id },
			data: data as any
		});

		this.#patch(entry);
	}

	public async reload() {
		const entry = await container.prisma.schedule.findUnique({ where: { id: this.id } });
		if (entry === null) throw new Error('Failed to reload the entity');

		this.#patch(entry);
	}

	#patch(data: Omit<schedule, 'id' | 'taskId'>) {
		this.time = data.time;
		this.recurring = isNullishOrEmpty(data.recurring) ? null : new Cron(data.recurring);
		this.catchUp = data.catchUp;
		this.data = data.data as ScheduleEntry.TaskData[Type];
	}

	public static async create<const Type extends ScheduleEntry.TaskId>(data: ScheduleEntry.CreateData<Type>): Promise<ScheduleEntry<Type>> {
		const entry = await container.prisma.schedule.create({ data: data as any });
		return new ScheduleEntry(entry);
	}
}

export const enum ResponseType {
	Ignore,
	Delay,
	Update,
	Finished
}

export type PartialResponseValue =
	| { type: ResponseType.Ignore | ResponseType.Finished }
	| { type: ResponseType.Delay; value: number }
	| { type: ResponseType.Update; value: Date };

export type ResponseValue = PartialResponseValue & { entry: ScheduleEntry };

export namespace ScheduleEntry {
	export type TaskId = keyof TaskData;

	export interface TaskData {
		birthday: BirthdayTaskData;
		poststats: null;
		syncResourceAnalytics: null;
		moderationEndAddRole: SharedModerationTaskData<TypeVariation.RoleAdd>;
		moderationEndBan: SharedModerationTaskData<TypeVariation.Ban>;
		moderationEndMute: SharedModerationTaskData<TypeVariation.Mute>;
		moderationEndRemoveRole: SharedModerationTaskData<TypeVariation.RoleRemove>;
		moderationEndRestrictionAttachment: SharedModerationTaskData<TypeVariation.RestrictedAttachment>;
		moderationEndRestrictionEmbed: SharedModerationTaskData<TypeVariation.RestrictedEmbed>;
		moderationEndRestrictionEmoji: SharedModerationTaskData<TypeVariation.RestrictedEmoji>;
		moderationEndRestrictionReaction: SharedModerationTaskData<TypeVariation.RestrictedReaction>;
		moderationEndRestrictionVoice: SharedModerationTaskData<TypeVariation.RestrictedVoice>;
		moderationEndSetNickname: SharedModerationTaskData<TypeVariation.SetNickname>;
		moderationEndTimeout: SharedModerationTaskData<TypeVariation.Timeout>;
		moderationEndVoiceMute: SharedModerationTaskData<TypeVariation.VoiceMute>;
		moderationEndWarning: SharedModerationTaskData<TypeVariation.Warning>;
		reminder: ReminderTaskData;
		removeBirthdayRole: RemoveBirthdayRoleTaskData;
	}

	export interface SharedModerationTaskData<Type extends TypeVariation> {
		[SchemaKeys.Case]: number;
		[SchemaKeys.User]: string;
		[SchemaKeys.Guild]: string;
		[SchemaKeys.Type]: number;
		[SchemaKeys.Duration]: number | null;
		[SchemaKeys.ExtraData]: ModerationManager.ExtraData<Type>;
		[SchemaKeys.Refrence]: number | null;
		scheduleRetryCount?: number;
	}

	export interface BirthdayTaskData extends BirthdayData {
		guildId: string;
		userId: string;
	}

	export interface ReminderTaskData {
		channelId: string | null;
		createdChannelId: string;
		userId: string;
		text: string | null;
		json: JSONEmbed | null;
		repeat: number | null;
		timeago: Date;
	}

	export interface RemoveBirthdayRoleTaskData {
		roleId: string;
		guildId: string;
		userId: string;
	}

	export interface CreateData<Type extends TaskId> {
		taskId: Type;
		time: Date | string;
		recurring: string | null;
		catchUp: boolean;
		data: TaskData[Type];
	}

	export interface UpdateData<Type extends TaskId> {
		time?: Date;
		recurring?: string | null;
		catchUp?: boolean;
		data?: TaskData[Type];
	}
}
