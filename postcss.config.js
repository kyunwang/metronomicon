module.exports = {
	'postcss-preset-env': {
		features: {
			'nesting-rules': true,
			'custom-media-queries': true,
			'media-query-ranges': true,
		},
		autoprefixer: {
			grid: false,
			flexbox: false,
		},
		stage: 0,
	},
};
