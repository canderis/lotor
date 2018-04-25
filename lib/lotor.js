(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("lotor", [], factory);
	else if(typeof exports === 'object')
		exports["lotor"] = factory();
	else
		root["lotor"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/bif.js":
/*!********************!*\
  !*** ./src/bif.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bif = function () {
	function Bif(directory) {
		_classCallCheck(this, Bif);

		this.directory = directory;
		this.fileExtensionLookup = initFileExtensionLookup();
	}

	_createClass(Bif, [{
		key: 'getBifTree',
		value: function getBifTree() {
			if (!this.bifTree) {
				this.buildBifTree();
			}

			return this.bifTree;
		}
	}, {
		key: 'initFileExtensionLookup',
		value: function initFileExtensionLookup() {
			return {
				'1': { fileExtension: 'bmp', editors: [] },
				'3': { fileExtension: 'tga', editors: [] },
				'0': { fileExtension: 'res', editors: [] },
				'4': { fileExtension: 'wav', editors: [] },
				'6': { fileExtension: 'plt', editors: [] },
				'7': { fileExtension: 'ini', editors: [] },
				'8': { fileExtension: 'mp3', editors: [] },
				'9': { fileExtension: 'mpg', editors: [] },
				'10': { fileExtension: 'txt', editors: [] },
				'11': { fileExtension: 'wma', editors: [] },
				'12': { fileExtension: 'wmv', editors: [] },
				'13': { fileExtension: 'xmv', editors: [] },
				'2000': { fileExtension: 'plh', editors: [] },
				'2001': { fileExtension: 'tex', editors: [] },
				'2002': { fileExtension: 'mdl', editors: [] },
				'2003': { fileExtension: 'thg', editors: [] },
				'2005': { fileExtension: 'fnt', editors: [] },
				'2007': { fileExtension: 'lua', editors: [] },
				'2008': { fileExtension: 'slt', editors: [] },
				'2009': { fileExtension: 'nss', editors: [] },
				'2010': { fileExtension: 'ncs', editors: [] },
				'2011': { fileExtension: 'mod', editors: [] },
				'2012': { fileExtension: 'are', editors: [] },
				'2013': { fileExtension: 'set', editors: [] },
				'2014': { fileExtension: 'ifo', editors: [] },
				'2015': { fileExtension: 'bic', editors: [] },
				'2016': { fileExtension: 'wok', editors: [] },
				'2017': { fileExtension: '2da', editors: [] },
				'2018': { fileExtension: 'tlk', editors: [] },
				'2022': { fileExtension: 'txi', editors: [] },
				'2023': { fileExtension: 'git', editors: [] },
				'2024': { fileExtension: 'bti', editors: [] },
				'2025': { fileExtension: 'uti', editors: [] },
				'2026': { fileExtension: 'btc', editors: [] },
				'2027': { fileExtension: 'utc', editors: [] },
				'2029': { fileExtension: 'dlg', editors: [] },
				'2030': { fileExtension: 'itp', editors: [] },
				'2031': { fileExtension: 'btt', editors: [] },
				'2032': { fileExtension: 'utt', editors: [] },
				'2033': { fileExtension: 'dds', editors: [] },
				'2034': { fileExtension: 'bts', editors: [] },
				'2035': { fileExtension: 'uts', editors: [] },
				'2036': { fileExtension: 'ltr', editors: [] },
				'2037': { fileExtension: 'gff', editors: [] },
				'2038': { fileExtension: 'fac', editors: [] },
				'2039': { fileExtension: 'bte', editors: [] },
				'2040': { fileExtension: 'ute', editors: [] },
				'2041': { fileExtension: 'btd', editors: [] },
				'2042': { fileExtension: 'utd', editors: [] },
				'2043': { fileExtension: 'btp', editors: [] },
				'2044': { fileExtension: 'utp', editors: [] },
				'2045': { fileExtension: 'dft', editors: [] },
				'2046': { fileExtension: 'gic', editors: [] },
				'2047': { fileExtension: 'gui', editors: [] },
				'2048': { fileExtension: 'css', editors: [] },
				'2049': { fileExtension: 'ccs', editors: [] },
				'2050': { fileExtension: 'btm', editors: [] },
				'2051': { fileExtension: 'utm', editors: [] },
				'2052': { fileExtension: 'dwk', editors: [] },
				'2053': { fileExtension: 'pwk', editors: [] },
				'2054': { fileExtension: 'btg', editors: [] },
				'2055': { fileExtension: 'utg', editors: [] },
				'2056': { fileExtension: 'jrl', editors: [] },
				'2057': { fileExtension: 'sav', editors: [] },
				'2058': { fileExtension: 'utw', editors: [] },
				'2059': { fileExtension: '4pc', editors: [] },
				'2060': { fileExtension: 'ssf', editors: [] },
				'2061': { fileExtension: 'hak', editors: [] },
				'2062': { fileExtension: 'nwm', editors: [] },
				'2063': { fileExtension: 'bik', editors: [] },
				'2064': { fileExtension: 'ndb', editors: [] },
				'2065': { fileExtension: 'ptm', editors: [] },
				'2066': { fileExtension: 'ptt', editors: [] },
				'3000': { fileExtension: 'lyt', editors: [] },
				'3001': { fileExtension: 'vis', editors: [] },
				'3002': { fileExtension: 'rim', editors: [] },
				'3003': { fileExtension: 'pth', editors: [] },
				'3004': { fileExtension: 'lip', editors: [] },
				'3005': { fileExtension: 'bwm', editors: [] },
				'3006': { fileExtension: 'txb', editors: [] },
				'3007': { fileExtension: 'tpc', editors: [] },
				'3008': { fileExtension: 'mdx', editors: [] },
				'3009': { fileExtension: 'rsv', editors: [] },
				'3010': { fileExtension: 'sig', editors: [] },
				'3011': { fileExtension: 'xbx', editors: [] },
				'9997': { fileExtension: 'erf', editors: [] },
				'9998': { fileExtension: 'bif', editors: [] },
				'9999': { fileExtension: 'key', editors: [] }
			};
		}
	}]);

	return Bif;
}();

exports.default = Bif;
;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bif = undefined;

var _bif = __webpack_require__(/*! ./bif.js */ "./src/bif.js");

var _bif2 = _interopRequireDefault(_bif);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.bif = _bif2.default;

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/index.js */"./src/index.js");


/***/ })

/******/ });
});
//# sourceMappingURL=lotor.js.map