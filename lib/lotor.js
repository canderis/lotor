(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("lotor", [], factory);
	else if(typeof exports === 'object')
		exports["lotor"] = factory();
	else
		root["lotor"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
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
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/int64-buffer/int64-buffer.js":
/*!***************************************************!*\
  !*** ./node_modules/int64-buffer/int64-buffer.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// int64-buffer.js

/*jshint -W018 */ // Confusing use of '!'.
/*jshint -W030 */ // Expected an assignment or function call and instead saw an expression.
/*jshint -W093 */ // Did you mean to return a conditional instead of an assignment?

var Uint64BE, Int64BE, Uint64LE, Int64LE;

!function(exports) {
  // constants

  var UNDEFINED = "undefined";
  var BUFFER = (UNDEFINED !== typeof Buffer) && Buffer;
  var UINT8ARRAY = (UNDEFINED !== typeof Uint8Array) && Uint8Array;
  var ARRAYBUFFER = (UNDEFINED !== typeof ArrayBuffer) && ArrayBuffer;
  var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
  var isArray = Array.isArray || _isArray;
  var BIT32 = 4294967296;
  var BIT24 = 16777216;

  // storage class

  var storage; // Array;

  // generate classes

  Uint64BE = factory("Uint64BE", true, true);
  Int64BE = factory("Int64BE", true, false);
  Uint64LE = factory("Uint64LE", false, true);
  Int64LE = factory("Int64LE", false, false);

  // class factory

  function factory(name, bigendian, unsigned) {
    var posH = bigendian ? 0 : 4;
    var posL = bigendian ? 4 : 0;
    var pos0 = bigendian ? 0 : 3;
    var pos1 = bigendian ? 1 : 2;
    var pos2 = bigendian ? 2 : 1;
    var pos3 = bigendian ? 3 : 0;
    var fromPositive = bigendian ? fromPositiveBE : fromPositiveLE;
    var fromNegative = bigendian ? fromNegativeBE : fromNegativeLE;
    var proto = Int64.prototype;
    var isName = "is" + name;
    var _isInt64 = "_" + isName;

    // properties
    proto.buffer = void 0;
    proto.offset = 0;
    proto[_isInt64] = true;

    // methods
    proto.toNumber = toNumber;
    proto.toString = toString;
    proto.toJSON = toNumber;
    proto.toArray = toArray;

    // add .toBuffer() method only when Buffer available
    if (BUFFER) proto.toBuffer = toBuffer;

    // add .toArrayBuffer() method only when Uint8Array available
    if (UINT8ARRAY) proto.toArrayBuffer = toArrayBuffer;

    // isUint64BE, isInt64BE
    Int64[isName] = isInt64;

    // CommonJS
    exports[name] = Int64;

    return Int64;

    // constructor
    function Int64(buffer, offset, value, raddix) {
      if (!(this instanceof Int64)) return new Int64(buffer, offset, value, raddix);
      return init(this, buffer, offset, value, raddix);
    }

    // isUint64BE, isInt64BE
    function isInt64(b) {
      return !!(b && b[_isInt64]);
    }

    // initializer
    function init(that, buffer, offset, value, raddix) {
      if (UINT8ARRAY && ARRAYBUFFER) {
        if (buffer instanceof ARRAYBUFFER) buffer = new UINT8ARRAY(buffer);
        if (value instanceof ARRAYBUFFER) value = new UINT8ARRAY(value);
      }

      // Int64BE() style
      if (!buffer && !offset && !value && !storage) {
        // shortcut to initialize with zero
        that.buffer = newArray(ZERO, 0);
        return;
      }

      // Int64BE(value, raddix) style
      if (!isValidBuffer(buffer, offset)) {
        var _storage = storage || Array;
        raddix = offset;
        value = buffer;
        offset = 0;
        buffer = new _storage(8);
      }

      that.buffer = buffer;
      that.offset = offset |= 0;

      // Int64BE(buffer, offset) style
      if (UNDEFINED === typeof value) return;

      // Int64BE(buffer, offset, value, raddix) style
      if ("string" === typeof value) {
        fromString(buffer, offset, value, raddix || 10);
      } else if (isValidBuffer(value, raddix)) {
        fromArray(buffer, offset, value, raddix);
      } else if ("number" === typeof raddix) {
        writeInt32(buffer, offset + posH, value); // high
        writeInt32(buffer, offset + posL, raddix); // low
      } else if (value > 0) {
        fromPositive(buffer, offset, value); // positive
      } else if (value < 0) {
        fromNegative(buffer, offset, value); // negative
      } else {
        fromArray(buffer, offset, ZERO, 0); // zero, NaN and others
      }
    }

    function fromString(buffer, offset, str, raddix) {
      var pos = 0;
      var len = str.length;
      var high = 0;
      var low = 0;
      if (str[0] === "-") pos++;
      var sign = pos;
      while (pos < len) {
        var chr = parseInt(str[pos++], raddix);
        if (!(chr >= 0)) break; // NaN
        low = low * raddix + chr;
        high = high * raddix + Math.floor(low / BIT32);
        low %= BIT32;
      }
      if (sign) {
        high = ~high;
        if (low) {
          low = BIT32 - low;
        } else {
          high++;
        }
      }
      writeInt32(buffer, offset + posH, high);
      writeInt32(buffer, offset + posL, low);
    }

    function toNumber() {
      var buffer = this.buffer;
      var offset = this.offset;
      var high = readInt32(buffer, offset + posH);
      var low = readInt32(buffer, offset + posL);
      if (!unsigned) high |= 0; // a trick to get signed
      return high ? (high * BIT32 + low) : low;
    }

    function toString(radix) {
      var buffer = this.buffer;
      var offset = this.offset;
      var high = readInt32(buffer, offset + posH);
      var low = readInt32(buffer, offset + posL);
      var str = "";
      var sign = !unsigned && (high & 0x80000000);
      if (sign) {
        high = ~high;
        low = BIT32 - low;
      }
      radix = radix || 10;
      while (1) {
        var mod = (high % radix) * BIT32 + low;
        high = Math.floor(high / radix);
        low = Math.floor(mod / radix);
        str = (mod % radix).toString(radix) + str;
        if (!high && !low) break;
      }
      if (sign) {
        str = "-" + str;
      }
      return str;
    }

    function writeInt32(buffer, offset, value) {
      buffer[offset + pos3] = value & 255;
      value = value >> 8;
      buffer[offset + pos2] = value & 255;
      value = value >> 8;
      buffer[offset + pos1] = value & 255;
      value = value >> 8;
      buffer[offset + pos0] = value & 255;
    }

    function readInt32(buffer, offset) {
      return (buffer[offset + pos0] * BIT24) +
        (buffer[offset + pos1] << 16) +
        (buffer[offset + pos2] << 8) +
        buffer[offset + pos3];
    }
  }

  function toArray(raw) {
    var buffer = this.buffer;
    var offset = this.offset;
    storage = null; // Array
    if (raw !== false && offset === 0 && buffer.length === 8 && isArray(buffer)) return buffer;
    return newArray(buffer, offset);
  }

  function toBuffer(raw) {
    var buffer = this.buffer;
    var offset = this.offset;
    storage = BUFFER;
    if (raw !== false && offset === 0 && buffer.length === 8 && Buffer.isBuffer(buffer)) return buffer;
    var dest = new BUFFER(8);
    fromArray(dest, 0, buffer, offset);
    return dest;
  }

  function toArrayBuffer(raw) {
    var buffer = this.buffer;
    var offset = this.offset;
    var arrbuf = buffer.buffer;
    storage = UINT8ARRAY;
    if (raw !== false && offset === 0 && (arrbuf instanceof ARRAYBUFFER) && arrbuf.byteLength === 8) return arrbuf;
    var dest = new UINT8ARRAY(8);
    fromArray(dest, 0, buffer, offset);
    return dest.buffer;
  }

  function isValidBuffer(buffer, offset) {
    var len = buffer && buffer.length;
    offset |= 0;
    return len && (offset + 8 <= len) && ("string" !== typeof buffer[offset]);
  }

  function fromArray(destbuf, destoff, srcbuf, srcoff) {
    destoff |= 0;
    srcoff |= 0;
    for (var i = 0; i < 8; i++) {
      destbuf[destoff++] = srcbuf[srcoff++] & 255;
    }
  }

  function newArray(buffer, offset) {
    return Array.prototype.slice.call(buffer, offset, offset + 8);
  }

  function fromPositiveBE(buffer, offset, value) {
    var pos = offset + 8;
    while (pos > offset) {
      buffer[--pos] = value & 255;
      value /= 256;
    }
  }

  function fromNegativeBE(buffer, offset, value) {
    var pos = offset + 8;
    value++;
    while (pos > offset) {
      buffer[--pos] = ((-value) & 255) ^ 255;
      value /= 256;
    }
  }

  function fromPositiveLE(buffer, offset, value) {
    var end = offset + 8;
    while (offset < end) {
      buffer[offset++] = value & 255;
      value /= 256;
    }
  }

  function fromNegativeLE(buffer, offset, value) {
    var end = offset + 8;
    value++;
    while (offset < end) {
      buffer[offset++] = ((-value) & 255) ^ 255;
      value /= 256;
    }
  }

  // https://github.com/retrofox/is-array
  function _isArray(val) {
    return !!val && "[object Array]" == Object.prototype.toString.call(val);
  }

}(typeof exports === 'object' && typeof exports.nodeName !== 'string' ? exports : (this || {}));


/***/ }),

/***/ "./src/2da.js":
/*!********************!*\
  !*** ./src/2da.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = __webpack_require__(/*! fs */ "fs");

var BINARY_PROLOGUE = '2DA V2.b';
var TEXT_PROLOGUE = '2DA V2.0';

var TwoDA = function () {
	function TwoDA() {
		var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

		_classCallCheck(this, TwoDA);

		this.filename = filename;
		this.labels = [];
		this.indices = [];
		this.rows = [];
		if (this.filename) {
			this.load();
		}
	}

	_createClass(TwoDA, [{
		key: 'load',
		value: function load() {
			//let twoDA = { labels: [], indices: [], rows: [] };

			var buf = fs.readFileSync(this.filename);
			console.log(buf.slice(0, 8).toString());

			var position = 0;
			var start = (BINARY_PROLOGUE + '\n').length;
			var end = buf.indexOf('\x00', start);
			var labels = buf.slice(start, end).toString().split(/\s/).filter(Boolean);
			this.labels = labels;
			console.log(labels);

			position = end + 1;
			var numRows = buf.readUInt32LE(position);
			console.log('rows ' + numRows);
			position += 4;

			console.log('position ' + position);
			//let test_string = '\t{' + numRows + '}';
			//position = buf.indexOf(test_string, position) + test_string.length;
			console.log('position ' + position);
			end = position;
			for (var i = 0; i < numRows; i++) {
				var jump = buf.indexOf('\t', end);
				if (jump !== -1) {
					//console.log('jump ' + jump);
					end = jump + 1;
				} else {
					console.error('malformed 2da: missed tab at ' + i + ', ' + position);
					return;
				}
			}
			console.log('indices: ' + position + '-' + end);
			this.indices = buf.slice(position, end - 1).toString().split(/\t/).filter(Boolean).map(Number);
			console.log(this.indices);
			position = end;
			// basically this is a block of sequential row numbers,
			// we just skip to the last one
			//XXX this is only going to work for sequential indexed table
			//position = buf.indexOf((numRows - 1) + '\t', position);
			//console.log('pre-offset position: ' + position);
			// we are now at the beginning of the last row number,
			// advance past the number and its trailing tab
			//position = buf.indexOf('\t', position) + 1;
			//console.log('pre-offset position: ' + position);

			var offsets = [];
			var temp = [];
			for (var _i = 0; _i < labels.length * numRows; _i++) {
				temp.push(buf.readUInt16LE(position));
				if ((_i + 1) % labels.length == 0) {
					offsets.push(temp);
					temp = [];
				}
				position += 2;
			}
			// advance past a double-null padding on the offsets section
			position += 2;
			//console.log(offsets);
			console.log('post offset position: ' + position);

			var max_offset = 0;
			for (var r in offsets) {
				var rows = offsets[r];
				var values = {};
				for (var c in rows) {
					var p = position + rows[c];
					end = buf.indexOf(0, p);
					if (rows[c] > max_offset) {
						max_offset = end - position;
					}
					if (end !== -1 && end > p) {
						values[labels[c]] = buf.slice(p, end).toString();
					} else {
						values[labels[c]] = '****';
					}
				}
				this.rows.push(values);
			}
			console.log('2DA is using ' + max_offset + '/65535 bytes, ' + max_offset / 65535 * 100 + '%');
			console.log(this);
		}
	}, {
		key: 'save',
		value: function save() {
			if (!this.filename || !this.filename.length || !this.labels || !this.labels.length || !this.rows || !this.rows.length) {
				//XXX save & load should be promises, despite nearly instantaneous
				return false;
			}

			var preamble_size = (BINARY_PROLOGUE + '\n').length + this.labels.join('\t').length + 1 + // trailing \t
			1 + // null pad
			4 + // numRows
			//([...this.rows.keys()].join('\t')).length + // row indices
			this.indices.join('\t').length + // row indices
			1 + // trailing \t
			2 * (this.rows.length * this.labels.length) + // offsets
			2 // 2x null pad
			;
			console.log('preamble size: ' + preamble_size);
			var value_pos = 0;
			var value_hash = {};
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var row = _step.value;

					//console.log(row);
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = this.labels[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var index = _step3.value;

							var val = row[index] === '****' ? '' : row[index];
							if (value_hash[val] !== undefined) {
								continue;
							}
							//console.log(val);
							value_hash[val] = value_pos;
							value_pos += val.length;
							value_pos += 1; // null pad
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			console.log('empty element offset: ' + value_hash['']);
			console.log('data size: ' + value_pos);
			var buf = new Buffer(preamble_size + value_pos);
			var buf_pos = 0;
			// prologue
			buf.write(BINARY_PROLOGUE + '\n', buf_pos);
			buf_pos += (BINARY_PROLOGUE + '\n').length;
			// labels
			buf.write(this.labels.join('\t') + '\t\0', buf_pos);
			buf_pos += this.labels.join('\t').length + 1 + // trailing \t
			1 // null pad
			;
			// numRows
			buf.writeUInt32LE(this.rows.length, buf_pos);
			buf_pos += 4;
			// row indices
			//buf.write([...this.rows.keys()].join('\t') + '\t', buf_pos);
			buf.write(this.indices.join('\t') + '\t', buf_pos);
			buf_pos += [].concat(_toConsumableArray(this.rows.keys())).join('\t').length + 1 // trailing \t
			;
			// offsets
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.rows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _row = _step2.value;

					//console.log(row);
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = this.labels[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var _index = _step4.value;

							var _val = _row[_index] === '****' ? '' : _row[_index];
							buf.writeUInt16LE(value_hash[_val], buf_pos);
							buf_pos += 2;
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			buf.write('\0\0', buf_pos);
			buf_pos += 2;
			// values
			var values = Object.keys(value_hash);
			values.sort(function (a, b) {
				return value_hash[a] - value_hash[b];
			});
			//console.log(values);
			buf.write(values.join('\0') + '\0', buf_pos);
			//console.log(Object.keys(value_hash));
			fs.writeFileSync(this.filename, buf);
			//console.log(new Buffer('a string\0'));
		}
	}]);

	return TwoDA;
}();

exports.default = TwoDA;

/***/ }),

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

var _chitin = __webpack_require__(/*! ./chitin.js */ "./src/chitin.js");

var _chitin2 = _interopRequireDefault(_chitin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = __webpack_require__(/*! fs */ "fs");
var path = __webpack_require__(/*! path */ "path");

var Bif = function () {
	function Bif() {
		var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

		_classCallCheck(this, Bif);

		this.filename = filename;
		this.keys = keys;
		this.fd = null;
	}

	_createClass(Bif, [{
		key: 'open',
		value: function open() {
			// already opened, nothing to do
			if (this.fd) return false;
			this.fd = fs.openSync(this.filename, 'r');
			// this call opened the file, indicate that by returning true
			return true;
		}
	}, {
		key: 'close',
		value: function close() {
			var opened = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			// if false value given, caller did not actually open
			if (!opened) return false;
			fs.closeSync(this.fd);
			this.fd = null;
		}
	}, {
		key: 'readHeader',
		value: function readHeader() {
			var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (this.header && !force) return;
			var opened = this.open();

			var headerSize = 20;
			var buffer = new Buffer(headerSize);
			fs.readSync(this.fd, buffer, 0, headerSize, 0);

			this.header = {
				number_of_variable_resources: buffer.readUInt32LE(8),
				number_of_fixed_resources: buffer.readUInt32LE(12),
				offset_to_variable_resources: buffer.readUInt32LE(16)
			};

			this.close(opened);
		}
	}, {
		key: 'read',
		value: function read(key) {
			var opened = this.open();

			if (!this.header) this.readHeader();

			var buffer = void 0;

			var variableSize = 16;
			buffer = new Buffer(variableSize);
			fs.readSync(this.fd, buffer, 0, variableSize, this.header.offset_to_variable_resources + variableSize * key.indexOfFileInBif);
			var variableTable = {
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
			fs.readSync(this.fd, buffer, 0, variableTable.size_of_raw_data_chunk, variableTable.offset_into_variable_resource_raw_data);

			this.close(opened);

			return buffer;
		}
	}, {
		key: 'extract',
		value: function extract(savepath) {
			var _this = this;

			var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (!this.filename) return console.log('ERROR: No bif file to extract from');
			var bif_keys = this.keys.filter(function (bif_key) {
				var re = new RegExp(bif_key.fileName, 'i');
				return !filename || filename.match(re);
			});
			console.log(bif_keys);
			if (!bif_keys.length) return console.log('WARN: Files not found in bif');;

			var opened = this.open();

			var _loop = function _loop(bif_key) {
				/* limit this before trying to actually implement,
       writing 1000+ small files concurrently = machine hurt */
				fs.writeFile(path.join(savepath, bif_key.fileName), _this.read(bif_key), function (err) {
					if (err) {
						console.log('ERROR: Failed to write file: ' + path.join(savepath, bif_key.fileName));
					} else {
						console.log('wrote ' + path.join(savepath, bif_key.fileName));
					}
				});
				//*/
				//fs.writeFileSync(path.join(savepath, bif_key.fileName), this.read(bif_key));
				//console.log('wrote ' + path.join(savepath, bif_key.fileName));
			};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = bif_keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var bif_key = _step.value;

					_loop(bif_key);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			this.close(opened);
		}
	}]);

	return Bif;
}();

exports.default = Bif;
;

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

/***/ }),

/***/ "./src/chitin.js":
/*!***********************!*\
  !*** ./src/chitin.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//chitin.js

var fs = __webpack_require__(/*! fs */ "fs");
var path = __webpack_require__(/*! path */ "path");
// workaround babel issue
var common = __webpack_require__(/*! ./common.js */ "./src/common.js").default;

var Chitin = function () {
	function Chitin() {
		var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

		_classCallCheck(this, Chitin);

		// initialize instance filename
		if (filename) {
			var _stat = fs.statSync(filename);
			if (_stat.isDirectory()) {
				filename = path.join(filename, Chitin.filename);
			}
		}
		this.filename = filename || Chitin.filename;
		this.path = path.dirname(this.filename);
		var stat = fs.statSync(this.filename);
		if (stat && stat.isFile()) {
			this.load();
		}
	}

	_createClass(Chitin, [{
		key: 'load',
		value: function load() {
			var me = this;
			var fd = fs.openSync(me.filename, 'r');

			me.header = me.readHeader(fd);
			me.files = me.parseFileList(fd);
			me.parseKeys(fd);

			fs.closeSync(fd);
		}
	}, {
		key: 'readHeader',
		value: function readHeader(fd) {
			var buffer = new Buffer(Chitin.headerSize);
			fs.readSync(fd, buffer, 0, Chitin.headerSize, 0);

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
	}, {
		key: 'parseFileList',
		value: function parseFileList(fd) {
			var me = this;
			var bifFiles = [];

			for (var i = 0; i < me.header.number_of_bif_files; i++) {
				var buffer = new Buffer(Chitin.bifEntrySize);
				fs.readSync(fd, buffer, 0, Chitin.bifEntrySize, me.header.offset_to_table_of_files + i * Chitin.bifEntrySize);

				var bif = {
					size_of_file: buffer.readUInt32LE(0),
					offset_into_filename_table_for_filename: buffer.readUInt32LE(4),
					length_of_filename: buffer.readUInt16LE(8),
					bif_drive: buffer.readUInt16LE(10)
				};

				var filenameBuffer = new Buffer(bif.length_of_filename);
				fs.readSync(fd, filenameBuffer, 0, bif.length_of_filename, bif.offset_into_filename_table_for_filename);

				var rawName = filenameBuffer.toString().replace(/\0/g, '').trim().replace('\\', path.sep);
				bif.rpath = path.dirname(rawName);
				bif.abspath = path.resolve(me.path, rawName);
				bif.filename = path.basename(rawName);

				bifFiles.push(bif);
			}

			return bifFiles;
		}
	}, {
		key: 'parseKeys',
		value: function parseKeys(fd) {
			var me = this;
			var bifFiles = me.files;
			for (var i = 0; i < me.header.number_of_entries_in_chitin_key; i++) {
				var buffer = new Buffer(Chitin.fileEntrySize);
				fs.readSync(fd, buffer, 0, Chitin.fileEntrySize, me.header.offset_to_table_of_keys + i * Chitin.fileEntrySize);

				var file = {
					resref: buffer.toString('utf8', 0, 16).replace(/\0/g, '').trim(),
					file_extension_code: buffer.readUInt16LE(16),
					uniqueId: buffer.readUInt32LE(18)
				};
				file.bifIndex = file.uniqueId >> 20;
				file.indexOfFileInBif = file.uniqueId - (file.bifIndex << 20);

				file.fileExtension = common.extensions_by_id[file.file_extension_code].fileExtension;
				file.fileName = file.resref + "." + file.fileExtension;
				//console.log(file);
				//file.fileName = file.fileName.trim().replace(/\0/g, '')

				if (!bifFiles[file.bifIndex]) console.log('Error File!!!', file);

				if (!bifFiles[file.bifIndex].files) bifFiles[file.bifIndex].files = [];

				bifFiles[file.bifIndex].files.push(file);
			}
			//console.log(bifFiles);
		}
	}]);

	return Chitin;
}();

exports.default = Chitin;
;

// static constant properties for Chitin class
Chitin.filename = 'chitin.key';
Chitin.headerSize = 60;
Chitin.bifEntrySize = 12;
Chitin.fileEntrySize = 22;

//export default Chitin;

/***/ }),

/***/ "./src/common.js":
/*!***********************!*\
  !*** ./src/common.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// common.js, shared structures and constants

exports.default = {
  extensions_by_id: {
    '0': { fileExtension: 'res', editors: [] },
    '1': { fileExtension: 'bmp', editors: [] },
    '2': { fileExtension: 'mve', editors: [] },
    '3': { fileExtension: 'tga', editors: [] },
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
  }
};

/***/ }),

/***/ "./src/erf.js":
/*!********************!*\
  !*** ./src/erf.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = __webpack_require__(/*! fs */ "fs");
var path = __webpack_require__(/*! path */ "path");
// workaround babel issue
var common = __webpack_require__(/*! ./common.js */ "./src/common.js").default;

var Erf = function () {
	function Erf() {
		var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

		_classCallCheck(this, Erf);

		this.filename = filename;
		this.fd = null;
		if (fs.existsSync(filename)) {
			//this.readHeader()
			this.load();
		}
	}

	_createClass(Erf, [{
		key: 'open',
		value: function open() {
			// already opened, nothing to do
			if (this.fd) return false;
			this.fd = fs.openSync(this.filename, 'r');
			// this call opened the file, indicate that by returning true
			return true;
		}
	}, {
		key: 'close',
		value: function close() {
			var opened = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			// if false value given, caller did not actually open
			if (!opened) return false;
			fs.closeSync(this.fd);
			this.fd = null;
		}
	}, {
		key: 'load',
		value: function load() {
			var me = this;
			var opened = me.open();

			me.readHeader();
			if (me.header.language_count) {
				me.readStrings();
			}
			me.parseFileList();

			me.close(opened);
		}
	}, {
		key: 'readHeader',
		value: function readHeader() {
			var me = this;
			var opened = me.open();

			var buffer = new Buffer(Erf.sizes.header);
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
				description_str_ref: buffer.readUInt32LE(40, 44)
			};

			//console.log(me.header);

			me.close(opened);
		}
	}, {
		key: 'readStrings',
		value: function readStrings() {
			var me = this;
			var opened = me.open();

			var buffer = new Buffer(me.header.localized_string_size);

			fs.readSync(this.fd, buffer, 0, me.header.entry_count * (Erf.sizes.key + Erf.sizes.resource), me.header.offset_to_key_list);

			me.strings = {};
			// read a string
			var lang_id = buffer.readUInt32LE(0, 4);
			var feminine = false;
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
	}, {
		key: 'parseFileList',
		value: function parseFileList() {
			var me = this;
			var opened = me.open();

			me.files = [];

			if (!me.header.entry_count) {
				return;
			}
			var buffer = new Buffer(me.header.entry_count * (Erf.sizes.key + Erf.sizes.resource));
			fs.readSync(this.fd, buffer, 0, me.header.entry_count * (Erf.sizes.key + Erf.sizes.resource), me.header.offset_to_key_list);

			me.files = [];
			for (var i = 0; i < me.header.entry_count; i++) {
				var key = {};
				var keypos = i * Erf.sizes.key;
				key.fileName = buffer.toString('utf-8', keypos, keypos + 16).replace(/\0+$/, '');
				key.res_id = buffer.readUInt32LE(keypos + 16, keypos + 20);
				key.res_type = common.extensions_by_id[buffer.readUInt16LE(keypos + 20, keypos + 22)].fileExtension;
				var res = {};
				var respos = me.header.entry_count * Erf.sizes.key + i * Erf.sizes.resource;
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
	}, {
		key: 'read',
		value: function read(key) {
			var me = this;
			var opened = this.open();

			if (!this.header) this.readHeader();

			var buffer = new Buffer(key.size);
			fs.readSync(this.fd, buffer, 0, key.size, key.offset);

			me.close(opened);

			return buffer;
		}
	}, {
		key: 'extract',
		value: function extract(savepath) {
			var _this = this;

			var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var me = this;
			var opened = me.open();

			var erf_keys = me.files.filter(function (erf_key) {
				var re = new RegExp(erf_key.fileName, 'i');
				return !filename || filename.match(re);
			});
			if (!erf_keys.length) {
				return;
			}

			var _loop = function _loop(key) {
				/* limit this before trying to actually implement,
       writing 1000+ small files concurrently = machine hurt */
				fs.writeFile(path.join(savepath, key.fileName), _this.read(key), function (err) {
					if (err) {
						console.log('ERROR: Failed to write file: ' + path.join(savepath, key.fileName));
					} else {
						console.log('wrote ' + path.join(savepath, key.fileName));
					}
				});
				//*/
				//fs.writeFileSync(path.join(savepath, key.fileName), this.read(key));
				//console.log('wrote ' + path.join(savepath, key.fileName));
			};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = erf_keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var key = _step.value;

					_loop(key);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			me.close(opened);
		}
	}]);

	return Erf;
}();

exports.default = Erf;


Erf.sizes = {
	header: 44,
	key: 24,
	resource: 8
};

/***/ }),

/***/ "./src/gff.js":
/*!********************!*\
  !*** ./src/gff.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GFF$simple_types;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = __webpack_require__(/*! fs */ "fs");
var Int64LE = __webpack_require__(/*! int64-buffer */ "./node_modules/int64-buffer/int64-buffer.js").Int64LE;
var UInt64LE = __webpack_require__(/*! int64-buffer */ "./node_modules/int64-buffer/int64-buffer.js").Uint64LE;

var GFF = function () {
	function GFF() {
		var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

		_classCallCheck(this, GFF);

		this.filename = filename;
		this.fd = null;
		this.header = null;
		this.root = null;
		if (this.filename) {
			this.load();
		}
	}

	_createClass(GFF, [{
		key: "open",
		value: function open() {
			// already opened, nothing to do
			if (this.fd) return false;
			this.fd = fs.openSync(this.filename, 'r');
			// this call opened the file, indicate that by returning true
			return true;
		}
	}, {
		key: "close",
		value: function close() {
			var opened = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			// if false value given, caller did not actually open
			if (!opened) return false;
			fs.closeSync(this.fd);
			this.fd = null;
		}
	}, {
		key: "load",
		value: function load() {
			var me = this;
			var opened = this.open();

			me.readHeader();
			this.buffer = fs.readFileSync(this.filename);
			me.root = me.readStruct(0);
			this.buffer = null;

			this.close(opened);
		}
	}, {
		key: "readHeader",
		value: function readHeader() {
			var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (this.header && !force) return;
			var opened = this.open();

			var headerSize = 56;
			var buffer = new Buffer(headerSize);
			fs.readSync(this.fd, buffer, 0, headerSize, 0);

			this.header = this.header || {};
			this.header.type = buffer.toString('utf8', 0, 4).trim().toLowerCase();
			this.header.version_string = buffer.toString('utf8', 4, 8).trim().toLowerCase();
			this.header.struct_offset = buffer.readUInt32LE(8);
			this.header.struct_count = buffer.readUInt32LE(12);
			this.header.field_offset = buffer.readUInt32LE(16);
			this.header.field_count = buffer.readUInt32LE(20);
			this.header.label_offset = buffer.readUInt32LE(24);
			this.header.label_count = buffer.readUInt32LE(28);
			this.header.field_data_offset = buffer.readUInt32LE(32);
			this.header.field_data_count = buffer.readUInt32LE(36);
			this.header.field_indices_offset = buffer.readUInt32LE(40);
			this.header.field_indices_count = buffer.readUInt32LE(44);
			this.header.list_indices_offset = buffer.readUInt32LE(48);
			this.header.list_indices_count = buffer.readUInt32LE(52);

			this.close(opened);
		}
	}, {
		key: "readStruct",
		value: function readStruct(struct_idx) {
			var struct = {};
			var struct_size = 12;
			var struct_offset = this.header.struct_offset + struct_size * struct_idx;
			struct.type = this.buffer.readInt32LE(struct_offset, struct_offset + 4);
			struct.data_or_data_offset = this.buffer.readInt32LE(struct_offset + 4, struct_offset + 8);
			struct.field_count = this.buffer.readInt32LE(struct_offset + 8, struct_offset + 12);

			if (struct.field_count == 1) {
				this.readField(struct, struct.data_or_data_offset);
			} else if (struct.field_count > 1) {
				var field_index_offset = this.header.field_indices_offset + struct.data_or_data_offset;
				//console.log(field_index_offset);
				var field_indices = [];
				for (var i = 0; i < struct.field_count; i++) {
					field_indices.push(this.buffer.readUInt32LE(field_index_offset + i * 4, field_index_offset + i * 4 + 4));
				}
				//console.log(field_indices);
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = field_indices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var field_index = _step.value;

						this.readField(struct, field_index);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}

			return struct;
		}
	}, {
		key: "readField",
		value: function readField(struct, field_index) {
			//console.log(field_index);
			struct.fields = struct.fields || [];
			var field = {};
			var field_size = 12;
			var field_offset = this.header.field_offset + field_size * field_index;

			field.type = this.buffer.readUInt32LE(field_offset);
			field.label_index = this.buffer.readUInt32LE(field_offset + 4);
			//field.data_or_data_offset = this.buffer.readUInt32LE(field_offset + 8, field_offset + 12);
			field.data_or_data_offset = this.buffer.slice(field_offset + 8, field_offset + 12);

			field.label = this.readLabel(field.label_index);
			field.value = this.readValue(field.type, field.data_or_data_offset);
			delete field.data_or_data_offset;
			console.log(field);

			struct.fields.push(field);
		}
	}, {
		key: "readLabel",
		value: function readLabel(label_index) {
			var label = '';

			var label_size = 16;
			var label_offset = this.header.label_offset + label_size * label_index;

			label = this.buffer.slice(label_offset, label_offset + label_size).toString().replace(/\0+$/, '');

			return label;
		}
	}, {
		key: "readValue",
		value: function readValue(type, data_or_offset) {
			var value = void 0;

			if (GFF.simple_types[type]) {
				// read the data
				switch (type) {
					case GFF.field_types.BYTE:
						value = data_or_offset[0];
						break;
					case GFF.field_types.CHAR:
						value = data_or_offset.readInt8(0);
						break;
					case GFF.field_types.WORD:
						value = data_or_offset.readUInt16LE(0);
						break;
					case GFF.field_types.SHORT:
						value = data_or_offset.readInt16LE(0);
						break;
					case GFF.field_types.DWORD:
						value = data_or_offset.readUInt32LE(0);
						break;
					case GFF.field_types.INT:
						value = data_or_offset.readInt32LE(0);
						break;
					case GFF.field_types.FLOAT:
						value = data_or_offset.readFloatLE(0);
						break;
					default:
						console.log('unknown simple type! ' + type);
				}
			} else {
				var offset = data_or_offset.readUInt32LE(0);
				switch (type) {
					case GFF.field_types.DWORD64:
						value = new UInt64LE(this.buffer.slice(this.header.field_data_offset + offset, this.header.field_data_offset + offset + 8));
						break;
					case GFF.field_types.INT64:
						value = new Int64LE(this.buffer.slice(this.header.field_data_offset + offset, this.header.field_data_offset + offset + 8));
						break;
					case GFF.field_types.DOUBLE:
						value = this.buffer.readDoubleLE(this.header.field_data_offset + offset);
						break;
					case GFF.field_types.CExoString:
						var string_length = this.buffer.readUInt32LE(this.header.field_data_offset + offset);
						value = this.buffer.slice(this.header.field_data_offset + offset + 4, this.header.field_data_offset + offset + 4 + string_length).toString();
						break;
					case GFF.field_types.CExoLocString:
						var total_length = this.buffer.readUInt32LE(this.header.field_data_offset + offset);
						var string_ref = this.buffer.readInt32LE(this.header.field_data_offset + offset + 4);
						var string_count = this.buffer.readUInt32LE(this.header.field_data_offset + offset + 8);
						value = [];
						var exo_offset = this.header.field_data_offset + offset + 12;
						while (string_ref == -1 && value.length < string_count) {
							var exo = {
								id: this.buffer.readInt32LE(exo_offset),
								length: this.buffer.readInt32LE(exo_offset + 4)
							};
							exo.value = this.buffer.slice(exo_offset + 8, exo_offset + 8 + exo.length).toString();
							value.push(exo);
							exo_offset += 8 + exo.length;
						}
						//console.log(string_ref);
						//console.log(string_count);
						break;
					case GFF.field_types.VOID:
						var binary_length = this.buffer.readUInt32LE(this.header.field_data_offset + offset);
						value = this.buffer.slice(this.header.field_data_offset + offset + 4, this.header.field_data_offset + offset + 4 + binary_length);
						break;
					case GFF.field_types.ResRef:
						var ref_length = this.buffer[this.header.field_data_offset + offset];
						value = this.buffer.slice(this.header.field_data_offset + offset + 1, this.header.field_data_offset + offset + 1 + ref_length).toString();
						break;
					case GFF.field_types.Struct:
						value = this.readStruct(offset);
						break;
					case GFF.field_types.List:
						var list_offset = this.header.list_indices_offset + offset;
						value = [];
						var struct_indices = [];
						var list_length = this.buffer.readUInt32LE(list_offset);
						for (var i = 0; i < list_length; i++) {
							struct_indices.push(this.buffer.readUInt32LE(list_offset + 4 + 4 * i));
						}
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = struct_indices[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var struct_index = _step2.value;

								value.push(this.readStruct(struct_index));
							}
							//console.log(struct_indices);
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}

						break;
					case GFF.field_types.Position:
						value = [this.buffer.readFloatLE(this.header.field_data_offset + offset), this.buffer.readFloatLE(this.header.field_data_offset + offset + 4), this.buffer.readFloatLE(this.header.field_data_offset + offset + 8)];
						break;
					case GFF.field_types.Orientation:
						value = [this.buffer.readFloatLE(this.header.field_data_offset + offset), this.buffer.readFloatLE(this.header.field_data_offset + offset + 4), this.buffer.readFloatLE(this.header.field_data_offset + offset + 8), this.buffer.readFloatLE(this.header.field_data_offset + offset + 12)];
						break;
					case GFF.field_types.StrRef:
						// size is 4
						value = this.buffer.readInt32LE(this.header.field_data_offset + offset + 4);
						break;
				}
			}

			return value;
		}
	}, {
		key: "find",
		value: function find(name) {
			var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.root;

			if (ctx && ctx.label && (ctx.label === name || ctx.label.match(new RegExp('^' + name + '$', 'i')))) {
				return ctx;
			}
			if (ctx && ctx.fields && ctx.fields.length) {
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = ctx.fields[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var child = _step3.value;

						var retval = this.find(name, child);
						if (retval) return retval;
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}
			}
			return null;
		}
	}, {
		key: "json",
		value: function json() {
			var data = {};

			data.header = this.header;
			data.root = {};

			this._to_json(data.root, this.root);

			return data;
		}
	}, {
		key: "_to_json",
		value: function _to_json(obj, field) {
			if (field.label) {
				obj[field.label] = field.value;
			}
			if (field.fields) {
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = field.fields[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var cfield = _step4.value;

						this._to_json(obj, cfield);
					}
				} catch (err) {
					_didIteratorError4 = true;
					_iteratorError4 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion4 && _iterator4.return) {
							_iterator4.return();
						}
					} finally {
						if (_didIteratorError4) {
							throw _iteratorError4;
						}
					}
				}
			}
		}
	}]);

	return GFF;
}();

exports.default = GFF;
;

GFF.field_types = {
	BYTE: 0, // uint8
	CHAR: 1, // int8
	WORD: 2, // uint16
	SHORT: 3, // int16
	DWORD: 4, // uint32
	INT: 5, // int32
	DWORD64: 6, // uint64 complex
	INT64: 7, // int64 complex
	FLOAT: 8, // float32
	DOUBLE: 9, // float64 complex
	CExoString: 10, // complex
	ResRef: 11, // complex
	CExoLocString: 12, // complex
	VOID: 13, // complex
	Struct: 14, // complex
	List: 15, // complex
	Orientation: 16, // complex
	Position: 17, // complex
	StrRef: 18 // complex
};

GFF.simple_types = (_GFF$simple_types = {}, _defineProperty(_GFF$simple_types, GFF.field_types.BYTE, true), _defineProperty(_GFF$simple_types, GFF.field_types.CHAR, true), _defineProperty(_GFF$simple_types, GFF.field_types.WORD, true), _defineProperty(_GFF$simple_types, GFF.field_types.SHORT, true), _defineProperty(_GFF$simple_types, GFF.field_types.DWORD, true), _defineProperty(_GFF$simple_types, GFF.field_types.INT, true), _defineProperty(_GFF$simple_types, GFF.field_types.FLOAT, true), _GFF$simple_types);

// CExoLocString
// 0 = neutral/masculine, 1 = feminine
GFF.language_ids = {
	ENGLISH: 0,
	FRENCH: 1,
	GERMAN: 2,
	ITALIAN: 3,
	SPANISH: 4,
	POLISH: 5,
	KOREAN: 128,
	CHINESE_TRADITIONAL: 129,
	CHINESE_SIMPLIFIED: 130,
	JAPANESE: 131
};

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

var _chitin = __webpack_require__(/*! ./chitin.js */ "./src/chitin.js");

var _chitin2 = _interopRequireDefault(_chitin);

var _bif = __webpack_require__(/*! ./bif.js */ "./src/bif.js");

var _bif2 = _interopRequireDefault(_bif);

var _erf = __webpack_require__(/*! ./erf.js */ "./src/erf.js");

var _erf2 = _interopRequireDefault(_erf);

var _rim = __webpack_require__(/*! ./rim.js */ "./src/rim.js");

var _rim2 = _interopRequireDefault(_rim);

var _tpc = __webpack_require__(/*! ./tpc.js */ "./src/tpc.js");

var _tpc2 = _interopRequireDefault(_tpc);

var _instance = __webpack_require__(/*! ./instance.js */ "./src/instance.js");

var _instance2 = _interopRequireDefault(_instance);

var _da = __webpack_require__(/*! ./2da.js */ "./src/2da.js");

var _da2 = _interopRequireDefault(_da);

var _gff = __webpack_require__(/*! ./gff.js */ "./src/gff.js");

var _gff2 = _interopRequireDefault(_gff);

var _common = __webpack_require__(/*! ./common.js */ "./src/common.js");

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lotor = void 0; // import game from './game.js';
//
// export { game };

exports.default = lotor = {
	archive: {
		Chitin: _chitin2.default,
		BIF: _bif2.default,
		ERF: _erf2.default,
		RIM: _rim2.default
	},
	texture: {
		TPC: _tpc2.default
	},
	game: {
		Instance: _instance2.default,
		TwoDA: _da2.default,
		GFF: _gff2.default
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

/***/ }),

/***/ "./src/instance.js":
/*!*************************!*\
  !*** ./src/instance.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// instance.js, wrapper object around a game instance, TSL or KotOR
var fs = __webpack_require__(/*! fs */ "fs");
var path = __webpack_require__(/*! path */ "path");

var Instance = function () {
	function Instance(directory) {
		_classCallCheck(this, Instance);

		this.abspath = path.resolve(directory);
		this.valid = false;
		this.version = null;
		this.validate();
		this.detect_version();
	}

	_createClass(Instance, [{
		key: 'validate',
		value: function validate() {
			if (!fs.existsSync(this.abspath) || !fs.existsSync(path.join(this.abspath, 'chitin.key'))) {
				this.valid = false;
				return;
			}
			this.valid = true;
		}
	}, {
		key: 'detect_version',
		value: function detect_version() {
			this.version = null;
			if (fs.existsSync(path.join(this.abspath, 'swkotor2.ini'))) {
				this.version = 'tsl';
			}
			if (fs.existsSync(path.join(this.abspath, 'swkotor.ini'))) {
				this.version = 'kotor';
			}
			if (!this.version) {
				// unable to detect version, path is invalid
				this.valid = false;
			}
		}
	}, {
		key: 'texture_packs',
		value: function texture_packs() {
			var data = fs.readdirSync(path.join(this.abspath, Instance.paths.texture_packs));

			var pattern = new RegExp('erf$', 'i');

			return data.filter(function (file) {
				return file.match(pattern);
			});
		}
	}, {
		key: 'modules',
		value: function modules() {
			var data = fs.readdirSync(path.join(this.abspath, Instance.paths.modules));

			var pattern = new RegExp('(?:mod|rim)$', 'i');

			return data.filter(function (file) {
				return file.match(pattern);
			});
		}
	}]);

	return Instance;
}();

exports.default = Instance;


Instance.paths = {
	texture_packs: 'TexturePacks',
	override: 'Override',
	modules: 'Modules'
};

/***/ }),

/***/ "./src/rim.js":
/*!********************!*\
  !*** ./src/rim.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

/***/ }),

/***/ "./src/tpc.js":
/*!********************!*\
  !*** ./src/tpc.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/index.js */"./src/index.js");


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })

/******/ });
});
//# sourceMappingURL=lotor.js.map