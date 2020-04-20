'use strict';
const fs = require('fs');
const path = require('path');
const binBuild = require('bin-build');
const log = require('logalot');
const which = require('which');
const binVersionCheck = require('bin-version-check');
const is = require('@sindresorhus/is');
const {promisify} = require('util');

const bin = require('.');

const install = async () => {
	const builder = await bin.run(['-version']).catch(error => {
		log.warn(error.message);
		log.warn('cwebp pre-build test failed');
		log.info('compiling from source');

		return binBuild.url('http://downloads.webmproject.org/releases/webp/libwebp-1.1.0.tar.gz', [
			`./configure --disable-shared --prefix="${bin.dest()}" --bindir="${bin.dest()}"`,
			'make && make install'
		]);
	});
	if (builder && is.nativePromise(builder)) {
		await builder().catch(error => {
			log.error(error.stack);
			throw error;
		});
		log.success('cwebp built successfully');
	}

	log.success('cwebp pre-build test passed successfully');
};

(async () => {
	const use = process.platform === 'win32' ? 'cwebp.exe' : 'cwebp';
	const systemBin = await which(use).catch(error => {
		throw error;
	});
	const version = '>=1.0.0';
	await binVersionCheck(systemBin, version, {args: ['-version']}).catch(error => {
		log.warn(`The \`${systemBin}\` binary doesn't seem to work correctly or doesn't satisfy version \`${version}\``);
		throw error;
	});
	const target = path.join(__dirname, '../vendor', use);
	await promisify(fs.symlink)(systemBin, target).catch(error => {
		if (error.code === 'EEXIST') {
			return;
		}

		log.warn(error.message);
		throw error;
	});
	log.success(`create cjpeg symlink \`${target}\``);
})().catch(() => {
	install().catch(() => {});
});
