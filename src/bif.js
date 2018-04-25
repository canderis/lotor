export default class Bif {
	constructor(directory, fs){
		var me = this;
		me.fs = fs;
		me.directory = directory;
		me.fileExtensionLookup = this.initFileExtensionLookup();

		var fd = me.fs.openSync(directory + '/chitin.key', 'r');

		me.chitinHeader = me.readChitinHeader(fd);
		me.bifFiles = me.parseBifFileDataInChitin(fd, me.chitinHeader);
		me.bifFiles = me.parseTableOfKeys(fd, me.chitinHeader, me.bifFiles, me.fileExtensionLookup);

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

	getBifTree(){
		if(!this.bifTree){
			this.buildBifTree();
		}

		return this.bifTree;
	}

	initFileExtensionLookup(){
		return {
			'1':    {fileExtension: 'bmp', editors:[]},
			'3':    {fileExtension: 'tga', editors:[]},
			'0':    {fileExtension: 'res', editors:[]},
			'4':    {fileExtension: 'wav', editors:[]},
			'6':    {fileExtension: 'plt', editors:[]},
			'7':    {fileExtension: 'ini', editors:[]},
			'8':    {fileExtension: 'mp3', editors:[]},
			'9':    {fileExtension: 'mpg', editors:[]},
			'10':   {fileExtension: 'txt', editors:[]},
			'11':   {fileExtension: 'wma', editors:[]},
			'12':   {fileExtension: 'wmv', editors:[]},
			'13':   {fileExtension: 'xmv', editors:[]},
			'2000': {fileExtension: 'plh', editors:[]},
			'2001': {fileExtension: 'tex', editors:[]},
			'2002': {fileExtension: 'mdl', editors:[]},
			'2003': {fileExtension: 'thg', editors:[]},
			'2005': {fileExtension: 'fnt', editors:[]},
			'2007': {fileExtension: 'lua', editors:[]},
			'2008': {fileExtension: 'slt', editors:[]},
			'2009': {fileExtension: 'nss', editors:[]},
			'2010': {fileExtension: 'ncs', editors:[]},
			'2011': {fileExtension: 'mod', editors:[]},
			'2012': {fileExtension: 'are', editors:[]},
			'2013': {fileExtension: 'set', editors:[]},
			'2014': {fileExtension: 'ifo', editors:[]},
			'2015': {fileExtension: 'bic', editors:[]},
			'2016': {fileExtension: 'wok', editors:[]},
			'2017': {fileExtension: '2da', editors:[]},
			'2018': {fileExtension: 'tlk', editors:[]},
			'2022': {fileExtension: 'txi', editors:[]},
			'2023': {fileExtension: 'git', editors:[]},
			'2024': {fileExtension: 'bti', editors:[]},
			'2025': {fileExtension: 'uti', editors:[]},
			'2026': {fileExtension: 'btc', editors:[]},
			'2027': {fileExtension: 'utc', editors:[]},
			'2029': {fileExtension: 'dlg', editors:[]},
			'2030': {fileExtension: 'itp', editors:[]},
			'2031': {fileExtension: 'btt', editors:[]},
			'2032': {fileExtension: 'utt', editors:[]},
			'2033': {fileExtension: 'dds', editors:[]},
			'2034': {fileExtension: 'bts', editors:[]},
			'2035': {fileExtension: 'uts', editors:[]},
			'2036': {fileExtension: 'ltr', editors:[]},
			'2037': {fileExtension: 'gff', editors:[]},
			'2038': {fileExtension: 'fac', editors:[]},
			'2039': {fileExtension: 'bte', editors:[]},
			'2040': {fileExtension: 'ute', editors:[]},
			'2041': {fileExtension: 'btd', editors:[]},
			'2042': {fileExtension: 'utd', editors:[]},
			'2043': {fileExtension: 'btp', editors:[]},
			'2044': {fileExtension: 'utp', editors:[]},
			'2045': {fileExtension: 'dft', editors:[]},
			'2046': {fileExtension: 'gic', editors:[]},
			'2047': {fileExtension: 'gui', editors:[]},
			'2048': {fileExtension: 'css', editors:[]},
			'2049': {fileExtension: 'ccs', editors:[]},
			'2050': {fileExtension: 'btm', editors:[]},
			'2051': {fileExtension: 'utm', editors:[]},
			'2052': {fileExtension: 'dwk', editors:[]},
			'2053': {fileExtension: 'pwk', editors:[]},
			'2054': {fileExtension: 'btg', editors:[]},
			'2055': {fileExtension: 'utg', editors:[]},
			'2056': {fileExtension: 'jrl', editors:[]},
			'2057': {fileExtension: 'sav', editors:[]},
			'2058': {fileExtension: 'utw', editors:[]},
			'2059': {fileExtension: '4pc', editors:[]},
			'2060': {fileExtension: 'ssf', editors:[]},
			'2061': {fileExtension: 'hak', editors:[]},
			'2062': {fileExtension: 'nwm', editors:[]},
			'2063': {fileExtension: 'bik', editors:[]},
			'2064': {fileExtension: 'ndb', editors:[]},
			'2065': {fileExtension: 'ptm', editors:[]},
			'2066': {fileExtension: 'ptt', editors:[]},
			'3000': {fileExtension: 'lyt', editors:[]},
			'3001': {fileExtension: 'vis', editors:[]},
			'3002': {fileExtension: 'rim', editors:[]},
			'3003': {fileExtension: 'pth', editors:[]},
			'3004': {fileExtension: 'lip', editors:[]},
			'3005': {fileExtension: 'bwm', editors:[]},
			'3006': {fileExtension: 'txb', editors:[]},
			'3007': {fileExtension: 'tpc', editors:[]},
			'3008': {fileExtension: 'mdx', editors:[]},
			'3009': {fileExtension: 'rsv', editors:[]},
			'3010': {fileExtension: 'sig', editors:[]},
			'3011': {fileExtension: 'xbx', editors:[]},
			'9997': {fileExtension: 'erf', editors:[]},
			'9998': {fileExtension: 'bif', editors:[]},
			'9999': {fileExtension: 'key', editors:[]}
		}
	}
};
