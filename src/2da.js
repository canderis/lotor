const fs = require('fs');

const BINARY_PROLOGUE = '2DA V2.b';
const TEXT_PROLOGUE = '2DA V2.0';

export default class TwoDA {
	constructor(filename = null) {
		this.filename = filename;
		this.labels = [];
		this.indices = [];
		this.rows = [];
		if (this.filename) {
			this.load();
		}
	}
	load() {
		//let twoDA = { labels: [], indices: [], rows: [] };

	  let buf = fs.readFileSync(this.filename);
	  console.log(buf.slice(0, 8).toString());

	  let position = 0;
	  let start = (BINARY_PROLOGUE + '\n').length;
	  let end = buf.indexOf('\x00', start);
	  let labels = buf.slice(start, end).toString().split(/\s/).filter(Boolean);
	  this.labels = labels;
	  console.log(labels);

	  position = end + 1;
	  let numRows = buf.readUInt32LE(position);
	  console.log('rows ' + numRows);
	  position += 4;

	  console.log('position ' + position);
	  //let test_string = '\t{' + numRows + '}';
	  //position = buf.indexOf(test_string, position) + test_string.length;
	  console.log('position ' + position);
	  end = position;
	  for (let i = 0; i < numRows; i++) {
	    let jump = buf.indexOf('\t', end);
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

	  let offsets = [];
	  let temp = [];
	  for (let i = 0; i < (labels.length * numRows); i++) {
	    temp.push(buf.readUInt16LE(position));
	    if ((i + 1) % labels.length == 0) {
	      offsets.push(temp);
	      temp = [];
	    }
	    position += 2;
	  }
	  // advance past a double-null padding on the offsets section
	  position += 2;
	  //console.log(offsets);
	  console.log('post offset position: ' + position);

	  let max_offset = 0;
	  for (let r in offsets) {
	    let rows = offsets[r];
	    let values = {};
	    for (let c in rows) {
	      let p = position + rows[c];
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
	  console.log(`2DA is using ${max_offset}/65535 bytes, ${(max_offset / 65535) * 100}%`);
	  console.log(this);
	}
	save() {
		if (!this.filename || !this.filename.length ||
	      !this.labels || !this.labels.length ||
	      !this.rows || !this.rows.length) {
	    //XXX save & load should be promises, despite nearly instantaneous
	    return false;
	  }

	  let preamble_size = (
	    (BINARY_PROLOGUE + '\n').length +
	    (this.labels.join('\t')).length +
	    1 + // trailing \t
	    1 + // null pad
	    4 + // numRows
	    //([...this.rows.keys()].join('\t')).length + // row indices
	    (this.indices.join('\t')).length + // row indices
	    1 + // trailing \t
	    (2 * (this.rows.length * this.labels.length)) + // offsets
	    2 // 2x null pad
	  );
	  console.log('preamble size: ' + preamble_size);
	  let value_pos  = 0;
	  let value_hash = {};
	  for (let row of this.rows) {
	    //console.log(row);
	    for (let index of this.labels) {
	      let val = row[index] === '****' ? '' : row[index];
	      if (value_hash[val] !== undefined) {
	        continue;
	      }
	      //console.log(val);
	      value_hash[val] = value_pos;
	      value_pos += val.length;
	      value_pos += 1; // null pad
	    }
	  }
	  console.log('empty element offset: ' + value_hash['']);
	  console.log('data size: ' + value_pos);
	  let buf = new Buffer(preamble_size + value_pos);
	  let buf_pos = 0;
	  // prologue
	  buf.write(BINARY_PROLOGUE + '\n', buf_pos);
	  buf_pos += (BINARY_PROLOGUE + '\n').length;
	  // labels
	  buf.write(this.labels.join('\t') + '\t\0', buf_pos)
	  buf_pos += (
	    (this.labels.join('\t')).length +
	    1 + // trailing \t
	    1   // null pad
	  );
	  // numRows
	  buf.writeUInt32LE(this.rows.length, buf_pos);
	  buf_pos += 4;
	  // row indices
	  //buf.write([...this.rows.keys()].join('\t') + '\t', buf_pos);
	  buf.write(this.indices.join('\t') + '\t', buf_pos);
	  buf_pos += (
	    ([...this.rows.keys()].join('\t')).length +
	    1   // trailing \t
	  );
	  // offsets
	  for (let row of this.rows) {
	    //console.log(row);
	    for (let index of this.labels) {
	      let val = row[index] === '****' ? '' : row[index];
	      buf.writeUInt16LE(value_hash[val], buf_pos);
	      buf_pos += 2;
	    }
	  }
	  buf.write('\0\0', buf_pos);
	  buf_pos += 2;
	  // values
	  let values = Object.keys(value_hash);
	  values.sort((a, b) => {
	    return value_hash[a] - value_hash[b];
	  });
	  //console.log(values);
	  buf.write(values.join('\0') + '\0', buf_pos);
	  //console.log(Object.keys(value_hash));
	  fs.writeFileSync(this.filename, buf);
	  //console.log(new Buffer('a string\0'));

	}
}
