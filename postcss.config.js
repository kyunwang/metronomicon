module.exports = {
	plugins: {
		'postcss-flexbugs-fixes': {},
		'postcss-preset-env': {
			autoprefixer: {
				grid: false,
				flexbox: 'no-2009',
			},
			stage: 0,
			features: {
				'custom-media-queries': true,
				'media-query-ranges': true,
				'nesting-rules': true,
				'custom-properties': false,
			},
		},
	},
};
