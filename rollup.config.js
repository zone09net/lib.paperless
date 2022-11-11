export default [
	{
		input: './.dist/lib.paperless/src/lib.paperless.js',
		output: {
			format: 'es',
			file: './.rollup/lib.paperless.js',
			paths: {
				'@zone09.net/foundation': './lib.foundation.js',
				'@zone09.net/paperless': './lib.paperless.js',
				'@zone09.net/hac': './lib.hac.js',
			 }
		},
	},
]