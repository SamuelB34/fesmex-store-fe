import type { NextConfig } from 'next'

const API_PROXY_TARGET =
	process.env.NEXT_PUBLIC_API_PROXY_TARGET ||
	'https://fesmex-store-be-api-production.up.railway.app'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 't3.storageapi.dev',
				pathname: '/**',
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${API_PROXY_TARGET}/:path*`,
			},
		]
	},
}

export default nextConfig
