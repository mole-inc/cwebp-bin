# cwebp-bin ![Node CI](https://github.com/mole-inc/cwebp-bin/workflows/Node%20CI/badge.svg)

> [WebP](https://developers.google.com/speed/webp/) is a new image format that provides lossless and lossy compression for images on the web. WebP lossless images are 26% smaller in size compared to PNGs. WebP lossy images are 25-34% smaller in size compared to JPEG images at equivalent SSIM index.

You probably want [`imagemin-webp`](https://github.com/mole-inc/imagemin-webp) instead.

[![Downloads](https://badgen.net/npm/dm/@mole-inc/cwebp-bin)](https://www.npmjs.com/package/@mole-inc/cwebp-bin)
[![Version](https://badgen.net/npm/v/@mole-inc/cwebp-bin)](https://www.npmjs.com/package/@mole-inc/cwebp-bin)
[![codecov](https://codecov.io/gh/mole-inc/cwebp-bin/branch/master/graph/badge.svg)](https://codecov.io/gh/mole-inc/cwebp-bin)

## Install

```
$ npm install @mole-inc/cwebp-bin
```


## Usage

```js
const {execFile} = require('child_process');
const cwebp = require('@mole-inc/cwebp-bin');

execFile(cwebp, ['input.png', '-o', 'output.webp'], err => {
	if (err) {
		throw err;
	}

	console.log('Image is converted!');
});
```


## CLI

```
$ npm install --global @mole-inc/cwebp-bin
```

```
$ cwebp --help
```


## License

This is a fork of [imagemin/cwebp-bin](https://github.com/imagemin/cwebp-bin) licensed under the MIT License.

see license file and vendor/cwebp-license.txt file.
