// import game from './game.js';
//
// export { game };

import chitin from './chitin.js';
import bif from './bif.js';
import erf from './erf.js';
import rim from './rim.js';

import tpc from './tpc.js';

import instance from './instance.js';
import twoda from './2da.js';
import gff from './gff.js';

import common from './common.js';

let lotor;

export default lotor = {
  archive: {
		Chitin: chitin,
		BIF: bif,
		ERF: erf,
		RIM: rim
	},
	texture: {
		TPC: tpc
	},
	game: {
		Instance: instance,
		TwoDA: twoda,
		GFF: gff
	}
};

/*
window.lotor = function(directory, fs){
	var me = {
		fileExtensionLookup:{
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
	};

	me.directory = directory;
	me.fs = fs;

	if (!fs.existsSync(directory)) {
		console.log('directory does not exist');
		return false;
	}

	var data = fs.readdirSync(directory);


	let key = data.find(function (row) {
		return row === 'chitin.key';
	})

	if (!key) {
		console.log('invalid directory');
		return false;
	}

	let game = data.find(function (row) {
		return row === 'swkotor2.ini';
	});

	if (game === 'swkotor2.ini') {
		me.game = 'TSL';
	}
	else{
		me.game = 'KOTOR'
	}


	me.bif = new bif(directory, fs, me);
	me.erf = new erf(directory, fs, me);

	return me;
};
*/
