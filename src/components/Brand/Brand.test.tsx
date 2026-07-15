import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Brand } from '@/components/Brand/Brand'

describe('Brand', () => {
	it('renders brand name', () => {
		render(<Brand text="Stanley" number={0} type="category" />)
		expect(screen.getByText('Stanley')).toBeDefined()
	})
})
