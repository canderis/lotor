const fs = require('fs');
const path = require('path');
// workaround babel issue
const common = require('./common.js').default;

export default class Erf {
	constructor(filename = null) {
		this.filename = filename;
		this.fd = null;
		if (fs.existsSync(filename)) {
			//this.readHeader()
			this.load()
		}
	}
	open() {
		// already opened, nothing to do
		if (this.fd) return false;
		this.fd = fs.openSync(this.filename, 'r');
		// this call opened the file, indicate that by returning true
		return true;
	}
	close(opened = true) {
		// if false value given, caller did not actually open
		if (!opened) return false;
		fs.closeSync(this.fd);
		this.fd = null;
	}
	load() {
		const me = this;
		const opened = me.open();

		me.readHeader();
		if (me.header.language_count) {
			me.readStrings();
		}
		me.parseFileList();

		me.close(opened);
	}
	readHeader() {
		const me = this;
		const opened = me.open();

		const buffer = new Buffer(Erf.sizes.header);
		fs.readSync(this.fd, buffer, 0, Erf.sizes.header);

		me.header = {
			type: buffer.toString('utf-8', 0, 4).trim().toLowerCase(),
			version_string: buffer.toString('utf-8', 4, 8).trim().toLowerCase(),
			language_count: buffer.readUInt32LE(8, 12),
			localized_string_size: buffer.readUInt32LE(12, 16),
			entry_count: buffer.readUInt32LE(16, 20),
			offset_to_localized_string: buffer.readUInt32LE(20, 24),
			offset_to_key_list: buffer.readUInt32LE(24, 28),
			offset_to_resource_list: buffer.readUInt32LE(28, 32),
			build_year: buffer.readUInt32LE(32, 36),
			build_day: buffer.readUInt32LE(36, 40),
			description_str_ref: buffer.readUInt32LE(40, 44),
		};

		//console.log(me.header);

		me.close(opened);
	}
	readStrings() {
		const me = this;
		const opened = me.open();

		let buffer = new Buffer(me.header.localized_string_size);

		fs.readSync(
			this.fd, buffer, 0,
			me.header.entry_count * (Erf.sizes.key + Erf.sizes.resource),
			me.header.offset_to_key_list
		);

		me.strings = {};
		// read a string
		let lang_id = buffer.readUInt32LE(0, 4);
		let feminine = false;
		if (lang_id % 2) {
			feminine = true;
			lang_id -= 1;
		}
		lang_id /= 2;
		//TODO select an encoding based on language ID
		// let str_size = buf.readUInt32LE(4, 8);
		// let s = buf.slice(8, 8 + str_size);
		// if (s.charCodeAt(s.length - 1) === 0) {
		// 	s = s.slice(0, -1);
		// }

		me.close(opened);
	}
	parseFileList() {
		const me = this;
		const opened = me.open();

		me.files = [];

		if (!me.header.entry_count) {
			return;
		}
		let buffer = new Buffer(me.header.entry_count * (Erf.sizes.key + Erf.sizes.resource));
		fs.readSync(
			this.fd, buffer, 0,
			me.header.entry_count * (Erf.sizes.key + Erf.sizes.resource),
			me.header.offset_to_key_list
		);

		me.files = [];
		for (let i = 0; i < me.header.entry_count; i++) {
			let key = {};
			let keypos = i * Erf.sizes.key;
			key.fileName = buffer.toString('utf-8', keypos, keypos + 16).replace(/\0+$/, '');
			key.res_id = buffer.readUInt32LE(keypos + 16, keypos + 20);
			key.res_type = common.extensions_by_id[buffer.readUInt16LE(keypos + 20, keypos + 22)].fileExtension;
			let res = {};
			let respos = me.header.entry_count * Erf.sizes.key + (i * Erf.sizes.resource);
			res.offset = buffer.readUInt32LE(respos, respos + 4);
			res.size = buffer.readUInt32LE(respos + 4, respos + 8);
			res.fileName = key.fileName + '.' + key.res_type;
			res.extractionType = 'erf';
			res.erfFileName = this.filename;
			//keys[key.filename + '.' + key.res_type] = res;
			me.files.push(res);
		}

		me.close(opened);
	}
	read(key) {
		const me = this;
		let opened = this.open();

		if (!this.header) this.readHeader();

		let buffer = new Buffer(key.size);
		fs.readSync(this.fd, buffer, 0, key.size, key.offset);

		me.close(opened);

		return buffer;
	}
	extract(savepath, filename = null) {
		const me = this;
		const opened = me.open();

		const erf_keys = me.files.filter((erf_key) => {
			const re = new RegExp(erf_key.fileName, 'i');
			return !filename || filename.match(re);
		});
		if (!erf_keys.length) {
			return;
		}

		for (const key of erf_keys) {
			/* limit this before trying to actually implement,
			   writing 1000+ small files concurrently = machine hurt */
			fs.writeFile(
				path.join(savepath, key.fileName), this.read(key),
				(err) => {
					if (err) {
						console.log('ERROR: Failed to write file: ' + path.join(savepath, key.fileName));
					} else {
					  console.log('wrote ' + path.join(savepath, key.fileName));
					}
				}
			);
			//*/
			//fs.writeFileSync(path.join(savepath, key.fileName), this.read(key));
			//console.log('wrote ' + path.join(savepath, key.fileName));
		}

		me.close(opened);
	}
}

Erf.sizes = {
	header: 44,
	key: 24,
	resource: 8,
};
