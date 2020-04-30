'use strict';
const fs = require('fs');
const path = require('path');
const binBuild = require('bin-build');
const log = require('logalot');
const which = require('which');
const binVersionCheck = require('bin-version-check');
const {promisify} = require('util');

const bin = require('.');

const install = async () => {
	try {
		await bin.run(['-version']);
		log.success('cwebp pre-build test passed successfully');
	} catch (error) {
		log.warn(error.message);
		log.warn('cwebp pre-build test failed');
		log.info('compiling from source');

		try {
			await binBuild.url('http://downloads.webmproject.org/releases/webp/libwebp-1.1.0.tar.gz', [
				`./configure --disable-shared --prefix="${bin.dest()}" --bindir="${bin.dest()}"`,
				'make && make install'
			]);
			log.success('cwebp built successfully');
		} catch {
			log.error(error.stack);
			throw error;
		}
	}
};

(async () => {
	try {
		const use = process.platform === 'win32' ? 'cwebp.exe' : 'cwebp';
		const systemBin = await which(use).catch(error => {
			throw error;
		});
		const version = '>=1.0.0';
		await binVersionCheck(systemBin, version, {args: ['-version']}).catch(error => {
			log.warn(`The \`${systemBin}\` binary doesn't seem to work correctly or doesn't satisfy version \`${version}\``);
			throw error;
		});
		const vendor = path.join(__dirname, '../vendor');
		await promisify(fs.mkdir)(vendor).catch(error => {
			if (error.code === 'EEXIST') {
				return;
			}

			log.warn(error.message);
			throw error;
		});
		const target = path.join(vendor, use);
		await promisify(fs.symlink)(systemBin, target).catch(error => {
			if (error.code === 'EEXIST') {
				return;
			}

			log.warn(error.message);
			throw error;
		});
		log.success(`create cwebp symlink \`${target}\``);
	} catch {
		await install().catch(() => {
			// eslint-disable-next-line unicorn/no-process-exit
			process.exit(1);
		});
	}
})();
