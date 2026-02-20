export type Section = {
	id: string
	text: string
	number: number
	type: 'category' | 'subcategory'
	active?: boolean
}

export type Product = {
	id: string
	name: string
	brand: string
	price: number
	oldPrice?: number
	currency: string
	stock: number
	image: string
}

export const sections: Section[] = [
	{
		id: '1',
		text: 'Todos los productos',
		number: 365,
		type: 'category',
		active: true,
	},
	{
		id: '1',
		text: 'Bombas & Bombeo',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'HVAC & Ventilación',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Válvulas & Fluidos',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Control y Automatización',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Protección y Seguridad',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Infraestructura',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Motores',
		number: 54,
		type: 'category',
	},
]

export const products: Product[] = [
	{
		id: 'p-1',
		name: 'Motor Globetrotter Propósito general',
		brand: 'Marathon',
		price: 127,
		oldPrice: 254,
		currency: 'MXN',
		stock: 34,
		image: '/illustrations/motor.svg',
	},
	{
		id: 'p-2',
		name: 'Ventilador industrial de alto flujo',
		brand: 'Big Ass Fans',
		price: 980,
		oldPrice: 1120,
		currency: 'MXN',
		stock: 12,
		image: '/illustrations/ventilador.svg',
	},
	{
		id: 'p-3',
		name: 'Motor para uso agrícola',
		brand: 'Marathon',
		price: 410,
		currency: 'MXN',
		stock: 8,
		image: '/illustrations/engine_2.svg',
	},
	{
		id: 'p-4',
		name: 'Motor de Velocidad Variable',
		brand: 'Marathon',
		price: 1450,
		oldPrice: 1690,
		currency: 'MXN',
		stock: 5,
		image: '/illustrations/engine_3.svg',
	},
]

export const brands: Section[] = [
	{
		id: '1',
		text: 'Marathon',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Big Ass Fans',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Flight',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Belimo',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'WATTS',
		number: 54,
		type: 'category',
	},
]

export const types: Section[] = [
	{
		id: '1',
		text: 'Bombas & Bombeo',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'HVAC & Ventilación',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Válvulas & Fluidos',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Control y Automatización',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Protección y Seguridad',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Infraestructura',
		number: 54,
		type: 'category',
	},
	{
		id: '1',
		text: 'Motores',
		number: 54,
		type: 'category',
	},
]
