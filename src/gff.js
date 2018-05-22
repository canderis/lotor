const fs = require('fs');
const Int64LE = require("int64-buffer").Int64LE;
const UInt64LE = require("int64-buffer").Uint64LE;

export default class GFF {
	constructor(filename = null) {
		this.filename = filename;
		this.fd = null;
		this.header = null;
		this.root = null;
		if (this.filename) {
			this.load();
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
		let opened = this.open();

		me.readHeader();
		this.buffer = fs.readFileSync(this.filename);
		me.root = me.readStruct(0);
		this.buffer = null;

		this.close(opened);
	}
	readHeader(force = false) {
		if (this.header && !force) return;
		let opened = this.open();

		const headerSize = 56;
		let buffer = new Buffer(headerSize);
		fs.readSync(this.fd, buffer, 0, headerSize, 0);

		this.header = this.header || {};
  	this.header.type = buffer.toString('utf8', 0, 4).trim().toLowerCase();
	  this.header.version_string = buffer.toString('utf8', 4, 8).trim().toLowerCase();
	  this.header.struct_offset = buffer.readUInt32LE(8);
	  this.header.struct_count  = buffer.readUInt32LE(12);
	  this.header.field_offset  = buffer.readUInt32LE(16);
	  this.header.field_count   = buffer.readUInt32LE(20);
	  this.header.label_offset  = buffer.readUInt32LE(24);
	  this.header.label_count   = buffer.readUInt32LE(28);
	  this.header.field_data_offset = buffer.readUInt32LE(32);
	  this.header.field_data_count = buffer.readUInt32LE(36);
	  this.header.field_indices_offset = buffer.readUInt32LE(40);
	  this.header.field_indices_count = buffer.readUInt32LE(44);
	  this.header.list_indices_offset = buffer.readUInt32LE(48);
	  this.header.list_indices_count = buffer.readUInt32LE(52);

		this.close(opened);
	}
	readStruct(struct_idx) {
	  let struct = {};
	  let struct_size = 12;
	  let struct_offset = this.header.struct_offset + (struct_size * struct_idx);
	  struct.type = this.buffer.readInt32LE(struct_offset, struct_offset + 4);
	  struct.data_or_data_offset = this.buffer.readInt32LE(struct_offset + 4, struct_offset + 8);
	  struct.field_count = this.buffer.readInt32LE(struct_offset + 8, struct_offset + 12);

	  if (struct.field_count == 1) {
	    this.readField(struct, struct.data_or_data_offset);
	  } else if (struct.field_count > 1) {
	    let field_index_offset =
	      this.header.field_indices_offset + struct.data_or_data_offset;
	    //console.log(field_index_offset);
	    let field_indices = [];
	    for (let i = 0; i < struct.field_count; i++) {
	      field_indices.push(this.buffer.readUInt32LE(field_index_offset + (i * 4),field_index_offset + (i * 4) + 4));
	    }
	    //console.log(field_indices);
	    for (let field_index of field_indices) {
	      this.readField(struct, field_index);
	    }
	  }

	  return struct;
	}
	readField(struct, field_index) {
	  //console.log(field_index);
	  struct.fields = struct.fields || [];
	  let field = {};
	  let field_size = 12;
	  let field_offset = this.header.field_offset + (field_size * field_index);

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

	readLabel(label_index) {
	  let label = '';

	  let label_size = 16;
	  let label_offset = this.header.label_offset + (label_size * label_index);

	  label = this.buffer.slice(label_offset, label_offset + label_size).toString().replace(/\0+$/, '');

	  return label;
	}

	readValue(type, data_or_offset) {
	  let value;

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
	    let offset = data_or_offset.readUInt32LE(0);
	    switch (type) {
	      case GFF.field_types.DWORD64:
	        value = new UInt64LE(this.buffer.slice(
	          this.header.field_data_offset + offset,
	          this.header.field_data_offset + offset + 8
	        ));
	        break;
	      case GFF.field_types.INT64:
	        value = new Int64LE(this.buffer.slice(
	          this.header.field_data_offset + offset,
	          this.header.field_data_offset + offset + 8
	        ));
	        break;
	      case GFF.field_types.DOUBLE:
	        value = this.buffer.readDoubleLE(this.header.field_data_offset + offset);
	        break;
	      case GFF.field_types.CExoString:
	        let string_length = this.buffer.readUInt32LE(this.header.field_data_offset + offset);
	        value = this.buffer.slice(
	          this.header.field_data_offset + offset + 4,
	          this.header.field_data_offset + offset + 4 + string_length
	        ).toString();
	        break;
	      case GFF.field_types.CExoLocString:
	        let total_length = this.buffer.readUInt32LE(this.header.field_data_offset + offset);
	        let string_ref = this.buffer.readInt32LE(this.header.field_data_offset + offset + 4);
	        let string_count = this.buffer.readUInt32LE(this.header.field_data_offset + offset + 8);
	        value = [];
	        let exo_offset = this.header.field_data_offset + offset + 12;
	        while (string_ref == -1 && value.length < string_count) {
	          let exo = {
	            id: this.buffer.readInt32LE(exo_offset),
	            length: this.buffer.readInt32LE(exo_offset + 4),
	          };
	          exo.value = this.buffer.slice(exo_offset + 8, exo_offset + 8 + exo.length).toString()
	          value.push(exo);
	          exo_offset += 8 + exo.length;
	        }
	        //console.log(string_ref);
	        //console.log(string_count);
	        break;
	      case GFF.field_types.VOID:
	        let binary_length = this.buffer.readUInt32LE(this.header.field_data_offset + offset);
	        value = this.buffer.slice(
	          this.header.field_data_offset + offset + 4,
	          this.header.field_data_offset + offset + 4 + binary_length
	        );
	        break;
	      case GFF.field_types.ResRef:
	        let ref_length = this.buffer[this.header.field_data_offset + offset];
	        value = this.buffer.slice(
	          this.header.field_data_offset + offset + 1,
	          this.header.field_data_offset + offset + 1 + ref_length
	        ).toString();
	        break;
	      case GFF.field_types.Struct:
	        value = this.readStruct(offset);
	        break;
	      case GFF.field_types.List:
	        let list_offset = this.header.list_indices_offset + offset;
	        value = [];
	        let struct_indices = [];
	        let list_length = this.buffer.readUInt32LE(list_offset);
	        for (let i = 0; i < list_length; i++) {
	          struct_indices.push(this.buffer.readUInt32LE(list_offset + 4 + (4 * i)));
	        }
	        for (let struct_index of struct_indices) {
	          value.push(this.readStruct(struct_index));
	        }
	        //console.log(struct_indices);

	        break;
	      case GFF.field_types.Position:
	        value = [
	          this.buffer.readFloatLE(this.header.field_data_offset + offset),
	          this.buffer.readFloatLE(this.header.field_data_offset + offset + 4),
	          this.buffer.readFloatLE(this.header.field_data_offset + offset + 8),
	        ];
	        break;
	      case GFF.field_types.Orientation:
	        value = [
	          this.buffer.readFloatLE(this.header.field_data_offset + offset),
	          this.buffer.readFloatLE(this.header.field_data_offset + offset + 4),
	          this.buffer.readFloatLE(this.header.field_data_offset + offset + 8),
	          this.buffer.readFloatLE(this.header.field_data_offset + offset + 12),
	        ];
	        break;
	      case GFF.field_types.StrRef:
	        // size is 4
	        value = this.buffer.readInt32LE(this.header.field_data_offset + offset + 4);
	        break;
	    }
	  }

	  return value;
	}

	find(name, ctx = this.root) {
		if (ctx && ctx.label && (
	        ctx.label === name ||
	        ctx.label.match(new RegExp('^' + name + '$', 'i'))
				)) {
	    return ctx;
	  }
	  if (ctx && ctx.fields && ctx.fields.length) {
	    for (const child of ctx.fields) {
	      const retval = this.find(name, child);
	      if (retval) return retval;
	    }
	  }
	  return null;
	}

	json() {
	  const data = {};

	  data.header = this.header;
	  data.root = {};

	  this._to_json(data.root, this.root);

	  return data;
	}
	_to_json(obj, field) {
	  if (field.label) {
	    obj[field.label] = field.value;
	  }
	  if (field.fields) {
	    for (const cfield of field.fields) {
	      this._to_json(obj, cfield);
	    }
	  }
	}
};

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
  StrRef: 18, // complex
};

GFF.simple_types = {
	[GFF.field_types.BYTE]:  true,
	[GFF.field_types.CHAR]:  true,
	[GFF.field_types.WORD]:  true,
	[GFF.field_types.SHORT]: true,
	[GFF.field_types.DWORD]: true,
	[GFF.field_types.INT]:   true,
	[GFF.field_types.FLOAT]: true,
};

// CExoLocString
// 0 = neutral/masculine, 1 = feminine
GFF.language_ids = {
  ENGLISH:  0,
  FRENCH:   1,
  GERMAN:   2,
  ITALIAN:  3,
  SPANISH:  4,
  POLISH:   5,
  KOREAN:   128,
  CHINESE_TRADITIONAL: 129,
  CHINESE_SIMPLIFIED:  130,
  JAPANESE: 131,
};
