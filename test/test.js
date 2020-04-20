'use strict';
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const compareSize = require('compare-size');
const cwebp = require('..');

/* Compile test
const fs = require('fs');
const binBuild = require('bin-build');
test('rebuild the cwebp binaries', async t => {
	const temporary = tempy.directory();

	await binBuild
		.url('http://downloads.webmproject.org/releases/webp/libwebp-1.1.0.tar.gz', [
			`./configure --disable-shared --prefix="${temporary}" --bindir="${temporary}"`,
			'make && make install'
		]);

	t.true(fs.existsSync(path.join(temporary, 'cwebp')));
});
*/

test('return path to binary and verify that it is working', async t => {
	t.true(await binCheck(cwebp, ['-version']));
});

test('minify and convert a PNG to WebP', async t => {
	const temporary = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.png');
	const dest = path.join(temporary, 'test-png.webp');
	const args = [
		src,
		'-o',
		dest
	];

	await execa(cwebp, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] < result[src]);
});

test('minify and convert a JPG to WebP', async t => {
	const temporary = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.jpg');
	const dest = path.join(temporary, 'test-jpg.webp');
	const args = [
		src,
		'-o',
		dest
	];

	await execa(cwebp, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] < result[src]);
});
