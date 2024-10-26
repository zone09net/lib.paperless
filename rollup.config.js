export default [
	{
		input: './.dist/lib.paperless/src/lib.paperless.js',
		output: {
			format: 'es',
			file: './.rollup/lib.paperless.js',
			paths: {
				'@zone09.net/foundation': './lib.foundation.js',
				'@extlib/matter': './extlib/matter-0.20.0.min.js',
				'@extlib/poly-decomp': './extlib/poly-decomp-0.2.1.min.js',
				'@extlib/intersects': './extlib/intersects-2.7.1.min.js'
			 }
		},
	},
]