//chitin.js

const fs = require('fs');
const path = require('path');
// workaround babel issue
const common = require('./common.js').default;

export default class Chitin {
  constructor(filename = null) {
		// initialize instance filename
		if (filename) {
			let stat = fs.statSync(filename);
			if (stat.isDirectory()) {
				filename = path.join(filename, Chitin.filename);
			}
		}
		this.filename = filename || Chitin.filename;
		this.path = path.dirname(this.filename);
		let stat = fs.statSync(this.filename);
		if (stat && stat.isFile()) {
			this.load();
		}
	}
	load() {
		const me = this;
		const fd = fs.openSync(me.filename, 'r');

		me.header = me.readHeader(fd);
		me.files = me.parseFileList(fd);
		me.parseKeys(fd);

		fs.closeSync(fd);
	}
	readHeader(fd) {
		let buffer = new Buffer(Chitin.headerSize);
		fs.readSync(fd, buffer, 0, Chitin.headerSize, 0 );

		return {
			number_of_bif_files: buffer.readUInt32LE(8),
			number_of_entries_in_chitin_key: buffer.readUInt32LE(12),
			offset_to_table_of_files: buffer.readUInt32LE(16),
			offset_to_table_of_keys: buffer.readUInt32LE(20),
			build_year: buffer.readUInt32LE(24),
			build_day: buffer.readUInt32LE(28),
			header_length: Chitin.headerSize
		};
	}
	parseFileList(fd) {
		const me = this;
		const bifFiles = [];

		for (let i = 0; i < me.header.number_of_bif_files; i++) {
			let buffer = new Buffer(Chitin.bifEntrySize);
			fs.readSync(
				fd, buffer, 0, Chitin.bifEntrySize,
				me.header.offset_to_table_of_files + (i * Chitin.bifEntrySize)
			);

			const bif = {
				size_of_file: buffer.readUInt32LE(0),
				offset_into_filename_table_for_filename: buffer.readUInt32LE(4),
				length_of_filename: buffer.readUInt16LE(8),
				bif_drive: buffer.readUInt16LE(10),
			};

			let filenameBuffer = new Buffer(bif.length_of_filename);
			fs.readSync(
				fd, filenameBuffer, 0, bif.length_of_filename,
				bif.offset_into_filename_table_for_filename
			);

			var rawName = filenameBuffer.toString().replace(/\0/g, '').trim().replace('\\', path.sep);
			bif.rpath = path.dirname(rawName);
			bif.abspath = path.resolve(me.path, rawName);
			bif.filename = path.basename(rawName);

			bifFiles.push(bif);
		}

		return bifFiles;
	}
	parseKeys(fd) {
		const me = this;
		const bifFiles = me.files;
		for (let i = 0; i < me.header.number_of_entries_in_chitin_key; i++) {
			let buffer = new Buffer(Chitin.fileEntrySize);
			fs.readSync(
				fd, buffer, 0, Chitin.fileEntrySize,
				me.header.offset_to_table_of_keys + (i * Chitin.fileEntrySize)
			);

			let file = {
				resref: buffer.toString('utf8', 0, 16).replace(/\0/g, '').trim(),
				file_extension_code: buffer.readUInt16LE(16),
				uniqueId: buffer.readUInt32LE(18),
			};
			file.bifIndex = file.uniqueId >> 20
			file.indexOfFileInBif = file.uniqueId - (file.bifIndex << 20)

			file.fileExtension = common.extensions_by_id[file.file_extension_code].fileExtension;
			file.fileName = file.resref + "." + file.fileExtension;
			//console.log(file);
			//file.fileName = file.fileName.trim().replace(/\0/g, '')

			if(!bifFiles[file.bifIndex]) console.log('Error File!!!', file);

			if(!bifFiles[file.bifIndex].files) bifFiles[file.bifIndex].files = [];

			bifFiles[file.bifIndex].files.push(file);
		}
		//console.log(bifFiles);
	}
};

// static constant properties for Chitin class
Chitin.filename = 'chitin.key';
Chitin.headerSize = 60;
Chitin.bifEntrySize = 12;
Chitin.fileEntrySize = 22;

//export default Chitin;
