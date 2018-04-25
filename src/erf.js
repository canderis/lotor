export default class Erf {
    constructor(directory, fs, game){
        this.fs = fs;
        this.game = game;
        this.erf_sizes= {
					header: 44,
					key: 24,
					resource: 8,
				};
        this.readErfs(directory)
    }

    readErfs(directory){
		var me = this;
		var data = me.fs.readdirSync(directory + '/TexturePacks');
		var erfs = [];
		data.forEach(function(fileName){
			erfs.push(me.read_erf_file(directory + '/TexturePacks/', fileName));
		});



		return erfs;
	}

    read_erf_file(directory, fileName) {
		let me = this;
		let erf = {};
		let fd = me.fs.openSync(directory + fileName, 'r');
		let buf = new Buffer(me.erf_sizes.header);
		me.fs.readSync(fd, buf, 0, me.erf_sizes.header);
		erf.fileName = fileName;
		erf.header = me.read_erf_header(buf);
		if (erf.header.language_count) {
			//buf = new Buffer(erf.header.offset_to_key_list - erf.header.offset_to_localized_string);
			console.log('localized string size: ' + erf.header.localized_string_size);
			buf = new Buffer(erf.header.localized_string_size);
			me.fs.readSync(fd, buf, 0, erf.header.localized_string_size, erf.header.offset_to_localized_string);
			erf.strings = me.erf_read_localized_strings(buf, erf);
		}
		if (!erf.header.entry_count) {
			return erf;
		}
		buf = new Buffer(erf.header.entry_count * (me.erf_sizes.key + me.erf_sizes.resource));
		me.fs.readSync(fd, buf, 0, erf.header.entry_count * (me.erf_sizes.key + me.erf_sizes.resource), erf.header.offset_to_key_list);
		erf.files = me.read_erf_resources(buf, erf, fileName);
		erf.leaf = false;

		me.fs.closeSync(fd);

		if(erf.files.length >= 100 ){
			//alphabetize
			var alphabetized = {};
			erf.files.forEach( function(file){
				var letterKey = file.fileName.charAt(0).toUpperCase();
				if(!alphabetized[letterKey]){
					alphabetized[letterKey] = [];
				}
				alphabetized[letterKey].push(file);
			});

			var alphabetizedFiles = [];
			for(var key in alphabetized ){
				alphabetizedFiles.push({files: alphabetized[key], fileName: key + ' (' + alphabetized[key].length + ')'});
			}

			erf.files = alphabetizedFiles;
		}
		return erf;
	}

    read_erf_header(buf) {
		let erf = {};
		erf.type = buf.slice(0, 4).toString().trim().toLowerCase();
		erf.version_string = buf.slice(4, 8).toString().trim().toLowerCase();
		erf.language_count = buf.readUInt32LE(8, 12);
		erf.localized_string_size = buf.readUInt32LE(12, 16);
		erf.entry_count = buf.readUInt32LE(16, 20);
		erf.offset_to_localized_string = buf.readUInt32LE(20, 24);
		erf.offset_to_key_list = buf.readUInt32LE(24, 28);
		erf.offset_to_resource_list = buf.readUInt32LE(28, 32);
		erf.build_year = buf.readUInt32LE(32, 36);
		erf.build_day = buf.readUInt32LE(36, 40);
		erf.description_str_ref = buf.readUInt32LE(40, 44);
		return erf;
	}

	erf_read_localized_strings(buf, erf) {
		let str = {};
		// read a string
		let lang_id = buf.readUInt32LE(0, 4);
		let feminine = false;
		if (lang_id % 2) {
		feminine = true;
		lang_id -= 1;
		}
		lang_id /= 2;
		//TODO select an encoding based on language ID
		// let str_size = buf.readUInt32LE(4, 8);
		// // let s = buf.slice(8, 8 + str_size);
		// // if (s.charCodeAt(s.length - 1) === 0) {
		// // 	s = s.slice(0, -1);
		// // }
		return str;
	}

	read_erf_resources(buf, erf, fileName) {
		let keys = [];
		for (let i = 0; i < erf.header.entry_count; i++) {
			let key = {};
			let keypos = i * this.erf_sizes.key;
			key.fileName = buf.slice(keypos, keypos + 16).toString().replace(/\0+$/, '');
			key.res_id = buf.readUInt32LE(keypos + 16, keypos + 20);
			key.res_type = this.game.fileExtensionLookup[buf.readUInt16LE(keypos + 20, keypos + 22)].fileExtension;
			let res = {};
			let respos = erf.header.entry_count * this.erf_sizes.key + (i * this.erf_sizes.resource);
			res.offset = buf.readUInt32LE(respos, respos + 4);
			res.size = buf.readUInt32LE(respos + 4, respos + 8);
			res.fileName = key.fileName + '.' + key.res_type;
			res.leaf = true;
			res.extractionType = 'erf';
			res.erfFileName = fileName;
			//keys[key.filename + '.' + key.res_type] = res;
			keys.push(res);
		}
		return keys;
	}

}
