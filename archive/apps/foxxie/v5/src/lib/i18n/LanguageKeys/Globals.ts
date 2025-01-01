import { FT, T } from '#lib/types';

export const AbortOptions = T<string[]>('globals:abortOptions');
export const And = FT<{ value: string[] }, string>('globals:and');
export const Any = T('globals:any');
export const CaseT = T('globals:case');
export const DateValue = FT<{ value: Date | number }, string>('globals:dataValue');
export const DateDuration = FT<{ date: Date | number }, string>('globals:dateDuration');
export const DateFormat = T('globals:dateFormat');
export const DateFormatLong = T('globals:dateFormatLong');
export const DateFull = FT<{ date: Date | number }, string>('globals:dateFull');
export const DateShort = FT<{ date: Date | number }, string>('globals:dateShort');
export const DateTime = FT<{ date: Date | number }, string>('globals:dateTime');
export const DefaultT = FT<{ key: string }, string>(`globals:defaultT`);
export const DefaultLanguage = T('globals:defaultLanguage');
export const Duration = FT<{ duration: number | Date }, string>('globals:duration');
export const FullDateTime = FT<{ date: Date | number }, string>('globals:fullDateTime');
export const Infinte = T('globals:infinite');
export const Input = T('globals:input');
export const Me = T('globals:me');
export const No = T('globals:no');
export const None = T('globals:none');
export const NumberCompact = FT<{ value: number }, string>('globals:numberCompact');
export const NumberFormat = FT<{ value: number }, string>('globals:numberFormat');
export const NumberOrdinal = FT<{ value: number }, string>('globals:numberOrdinal');
export const Other = T('globals:other');
export const Remaining = FT<{ value: number | Date }, string>('globals:remaining');
export const ResetOptions = T<string[]>('globals:resetOptions');
export const Time = FT<{ value: Date | number }, string>('globals:time');
export const Unknown = T('globals:unknown');
export const Version = T('globals:version');
export const Yes = T('globals:yes');
export const You = T('globals:you');
