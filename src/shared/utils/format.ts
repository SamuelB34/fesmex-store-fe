export type CurrencyFormatOptions = {
	locale?: string
	currency?: string
	minimumFractionDigits?: number
	maximumFractionDigits?: number
}

export function formatCurrency(
	value: number,
	{
		locale = 'es-MX',
		currency = 'MXN',
		minimumFractionDigits = 2,
		maximumFractionDigits = 2,
	}: CurrencyFormatOptions = {},
): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits,
		maximumFractionDigits,
	}).format(value)
}

export type NumberFormatOptions = {
	locale?: string
	minimumFractionDigits?: number
	maximumFractionDigits?: number
}

export function formatNumber(
	value: number,
	{
		locale = 'es-MX',
		minimumFractionDigits,
		maximumFractionDigits,
	}: NumberFormatOptions = {},
): string {
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits,
		maximumFractionDigits,
	}).format(value)
}

export type DateFormatOptions = {
	locale?: string
	options?: Intl.DateTimeFormatOptions
}

export function formatDate(
	input: string | number | Date,
	{ locale = 'es-MX', options }: DateFormatOptions = {},
): string {
	const date = input instanceof Date ? input : new Date(input)
	if (Number.isNaN(date.getTime())) {
		return ''
	}

	const resolvedOptions: Intl.DateTimeFormatOptions = options ?? {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	}

	return new Intl.DateTimeFormat(locale, resolvedOptions).format(date)
}
