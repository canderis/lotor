import Chitin from './chitin.js';

const fs = require('fs');
const path = require('path');

export default class Bif {
	constructor(filename = null, keys = []) {
		this.filename = filename;
		this.keys = keys;
		this.fd = null;
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
	readHeader(force = false) {
		if (this.header && !force) return;
		let opened = this.open();

		const headerSize = 20;
		let buffer = new Buffer(headerSize);
		fs.readSync(this.fd, buffer, 0, headerSize, 0);

		this.header = {
			number_of_variable_resources: buffer.readUInt32LE(8),
			number_of_fixed_resources: buffer.readUInt32LE(12),
			offset_to_variable_resources: buffer.readUInt32LE(16)
		};

		this.close(opened);
	}
	read(key) {
		let opened = this.open();

		if (!this.header) this.readHeader();

		let buffer;

		const variableSize = 16;
		buffer = new Buffer(variableSize);
		fs.readSync(
			this.fd, buffer, 0, variableSize,
			this.header.offset_to_variable_resources +
			(variableSize * key.indexOfFileInBif)
		);
		let variableTable = {
			id: buffer.readUInt32LE(0),
			offset_into_variable_resource_raw_data: buffer.readUInt32LE(4),
			size_of_raw_data_chunk: buffer.readUInt32LE(8),
			resource_type: buffer.readUInt32LE(12)
		};
		/*
		console.log(variableTable);
		console.log(key);
		if (key.indexOfFileInBif > 10) {
			console.log(this.header);
			process.exit();
		}
		*/

		buffer = new Buffer(variableTable.size_of_raw_data_chunk);
		fs.readSync(
			this.fd, buffer, 0, variableTable.size_of_raw_data_chunk,
			variableTable.offset_into_variable_resource_raw_data
		);

		this.close(opened);

		return buffer;
	}
	extract(savepath, filename = null) {
		if (!this.filename) return console.log('ERROR: No bif file to extract from');
		const bif_keys = this.keys.filter((bif_key) => {
			const re = new RegExp(bif_key.fileName, 'i');
			return !filename || filename.match(re);
		});
		console.log(bif_keys);
		if (!bif_keys.length) return console.log('WARN: Files not found in bif');;

		let opened = this.open();

		for (const bif_key of bif_keys) {
			/* limit this before trying to actually implement,
			   writing 1000+ small files concurrently = machine hurt */
			fs.writeFile(
				path.join(savepath, bif_key.fileName), this.read(bif_key),
				(err) => {
					if (err) {
						console.log('ERROR: Failed to write file: ' + path.join(savepath, bif_key.fileName));
					} else {
					  console.log('wrote ' + path.join(savepath, bif_key.fileName));
					}
				}
			);
			//*/
			//fs.writeFileSync(path.join(savepath, bif_key.fileName), this.read(bif_key));
			//console.log('wrote ' + path.join(savepath, bif_key.fileName));
		}

		this.close(opened);
	}
};

/*
class BifOld {
	constructor(directory, fs, game){
		var me = this;
		me.fs = fs;
		me.directory = directory;
		me.game = game;
		var fd = me.fs.openSync(directory + '/chitin.key', 'r');

		me.chitinHeader = me.readChitinHeader(fd);
		me.bifFiles = me.parseBifFileDataInChitin(fd, me.chitinHeader);
		me.bifFiles = me.parseTableOfKeys(fd, me.chitinHeader, me.bifFiles, me.game.fileExtensionLookup);

		me.fs.closeSync(fd);

	}

	parseTableOfKeys(fd, chitinHeader, bifFiles, fileExtensionLookup){
		var me = this;
		for (let i = 0; i < chitinHeader.number_of_entries_in_chitin_key; i++) {
			let buffer = new Buffer(22);
			me.fs.readSync(fd, buffer, 0, 22, chitinHeader.offset_to_table_of_keys + (i * 22));

			let file = {
				resref: buffer.toString('utf8', 0, 16),
				file_extension_code: buffer.readUInt16LE(16),
				uniqueId: buffer.readUInt32LE(18),
				leaf: true,
				game: me.currentGame
			};

			file.bifIndex = file.uniqueId >> 20
			file.indexOfFileInBif = file.uniqueId - (file.bifIndex << 20)

			file.fileExtension = fileExtensionLookup[file.file_extension_code].fileExtension;
			file.fileName = file.resref + "." + file.fileExtension;
			file.fileName = file.fileName.trim().replace(/\0/g, '')


			if(!bifFiles[file.bifIndex]) console.log('Error File!!!', file);

			if(!bifFiles[file.bifIndex].files) bifFiles[file.bifIndex].files = [];

			bifFiles[file.bifIndex].files.push(file);
		}

		bifFiles.forEach(function(ele){
			if(ele.files.length >= 100){
				var sorted = {};
				ele.files.forEach(function(file){
					if(!sorted[file.fileExtension]){
						sorted[file.fileExtension] = [];
					}
					sorted[file.fileExtension].push(file);
				})


				//_.forEach(sorted, function(resourceType){
				for(var resourceTypeKey in sorted){
					if(sorted[resourceTypeKey].length >= 100){
						//alphabetize
						var alphabetized = {};
						sorted[resourceTypeKey].forEach( function(file){
							var letterKey = file.fileName.charAt(0);
							if(!alphabetized[letterKey]){
								alphabetized[letterKey] = [];
							}
							alphabetized[letterKey].push(file);
						});

						var alphabetizedFiles = [];
						for(var key in alphabetized ){
							alphabetizedFiles.push({files: alphabetized[key], fileName: key + ' (' + alphabetized[key].length + ')'});
						}

						sorted[resourceTypeKey] = alphabetizedFiles;
					}
				}

				var files = [];
				for(var key in sorted ){
					files.push({files: sorted[key], fileName: key});
				}



				ele.files = files;
			}

		})

		return bifFiles;
	}

	parseBifFileDataInChitin (fd, chitinHeader) {
		var me = this;
		var bifFiles = [];
		for (let i = 0; i < chitinHeader.number_of_bif_files; i++) {
			var bif = {};
			let buffer = new Buffer(12);
			me.fs.readSync(fd, buffer, 0, 12, chitinHeader.offset_to_table_of_files + (i * 12));

			var bif = {
				size_of_file: buffer.readUInt32LE(0),
				offset_into_filename_table_for_filename: buffer.readUInt32LE(4),
				length_of_filename: buffer.readUInt16LE(8),
				bif_drive: buffer.readUInt16LE(10),
			};

			let filenameBuffer = new Buffer(bif.length_of_filename);
			me.fs.readSync(fd, filenameBuffer, 0, bif.length_of_filename, bif.offset_into_filename_table_for_filename);

			var fileName = filenameBuffer.toString();
			bif.bif_filename = fileName;
			bif.fileName = fileName.replace("data\\", '').trim().replace(/\0/g, '');

			bifFiles.push(bif);

		}

		return bifFiles;
	}

	readChitinHeader (fd) {
		var me = this;
		let buffer = new Buffer(60);
		me.fs.readSync(fd, buffer, 0, 60, 0 );

		return {
			number_of_bif_files: buffer.readUInt32LE(8),
			number_of_entries_in_chitin_key: buffer.readUInt32LE(12),
			offset_to_table_of_files: buffer.readUInt32LE(16),
			offset_to_table_of_keys: buffer.readUInt32LE(20),
			build_year: buffer.readUInt32LE(24),
			build_day: buffer.readUInt32LE(28),
			header_length: 60
		};
	}

	extractBif( file, path, index ){
		var me = this;

		var fd = fs.openSync(path + "/" + me.bifFiles[index].files[0].files[file.bifIndex].bif_filename.trim().replace(/\\/g,"/").replace(/\0/g, ''), 'r');

		var buffer = new Buffer(20);
		fs.readSync(fd, buffer, 0, 20, 0 );

		var bifHeader = {
			number_of_variable_resources: buffer.readUInt32LE(8),
			number_of_fixed_resouces: buffer.readUInt32LE(12),
			offset_to_variable_resouces: buffer.readUInt32LE(16)
		};


		buffer = new Buffer(16);
		fs.readSync(fd, buffer, 0, 16, bifHeader.offset_to_variable_resouces + 16*file.indexOfFileInBif );
		var variableTable = {
			id: buffer.readUInt32LE(0),
			offset_into_variable_resource_raw_data: buffer.readUInt32LE(4),
			size_of_raw_data_chunk: buffer.readUInt32LE(8),
			resource_type: buffer.readUInt32LE(12)
		};

		buffer = new Buffer(variableTable.size_of_raw_data_chunk);
		fs.readSync(fd, buffer, 0, variableTable.size_of_raw_data_chunk, variableTable.offset_into_variable_resource_raw_data );

		return buffer;

	}

	extractErf( file, path, gameIndex ) {
		var me = this;

		var resoucePath = me.bifFiles[gameIndex].files[1];

		var index = _.findIndex(resoucePath, 'fileName', file.erfFileName);

		var fd = me.fs.openSync(path + "/" + "TexturePacks/" + file.erfFileName, 'r');

		let buf = new Buffer(file.size);
		me.fs.readSync( fd, buf, 0, file.size, file.offset );
		return buf;
	}

	getBifTree(){
		if(!this.bifTree){
			this.buildBifTree();
		}

		return this.bifTree;
	}

};
*/
