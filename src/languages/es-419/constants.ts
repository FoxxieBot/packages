import { Handler } from '#lib/I18n/structures/Handler';
import { TimeTypes } from '@sapphire/time-utilities';

export class SpanishLatinAmericaHandler extends Handler {
	public constructor() {
		super({
			name: 'es-419',
			duration: {
				[TimeTypes.Year]: {
					1: 'año',
					DEFAULT: 'años'
				},
				[TimeTypes.Month]: {
					1: 'mes',
					DEFAULT: 'meses'
				},
				[TimeTypes.Week]: {
					1: 'semana',
					DEFAULT: 'semanas'
				},
				[TimeTypes.Day]: {
					1: 'días',
					DEFAULT: 'días'
				},
				[TimeTypes.Hour]: {
					1: 'horas',
					DEFAULT: 'horas'
				},
				[TimeTypes.Minute]: {
					1: 'minuto',
					DEFAULT: 'minuto'
				},
				[TimeTypes.Second]: {
					1: 'segundo',
					DEFAULT: 'segundos'
				}
			}
		});
	}
}

export function ordinal(cardinal: number): string {
	const dec = cardinal % 10;

	switch (dec) {
		case 1:
			return `${cardinal}ro`;
		case 2:
			return `${cardinal}do`;
		case 3:
			return `${cardinal}ro`;
		case 0:
		case 7:
			return `${cardinal}mo`;
		case 8:
			return `${cardinal}vo`;
		case 9:
			return `${cardinal}no`;
		default:
			return `${cardinal}to`;
	}
}
