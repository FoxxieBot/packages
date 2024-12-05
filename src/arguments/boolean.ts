import { getT, LanguageKeys } from '#lib/i18n';
import { Argument, Resolvers } from '@sapphire/framework';
import { filterNullishOrEmpty } from '@sapphire/utilities';

export class CoreArgument extends Argument<boolean> {
	private defaultTruthValues: string[] | null = null;
	private defaultFalseValues: string[] | null = null;

	public run(parameter: string, context: Argument.Context) {
		let truths = context.args.t(LanguageKeys.Arguments.BooleanTruths).filter(filterNullishOrEmpty);
		let falses = context.args.t(LanguageKeys.Arguments.BooleanFalses).filter(filterNullishOrEmpty);

		if (!truths.length) truths = this.getDefaultTruthValues;
		if (!falses.length) falses = this.getDefaultFalseValues;

		return Resolvers.resolveBoolean(parameter, { truths, falses }) //
			.mapErrInto((identifier) => this.error({ parameter, identifier, context }));
	}

	private get getDefaultTruthValues() {
		return (this.defaultTruthValues ??= getT()(LanguageKeys.Arguments.BooleanTruths).filter(filterNullishOrEmpty));
	}

	private get getDefaultFalseValues() {
		return (this.defaultFalseValues ??= getT()(LanguageKeys.Arguments.BooleanFalses).filter(filterNullishOrEmpty));
	}
}
