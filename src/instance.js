// instance.js, wrapper object around a game instance, TSL or KotOR
const fs = require('fs');
const path = require('path');

export default class Instance {
  constructor(directory) {
  	this.abspath = path.resolve(directory);
		this.valid = false;
		this.version = null;
		this.validate();
		this.detect_version();
  }
	validate() {
		if (!fs.existsSync(this.abspath) ||
				!fs.existsSync(path.join(this.abspath, 'chitin.key'))) {
			this.valid = false;
			return;
		}
		this.valid = true;
	}
	detect_version() {
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
	texture_packs() {
		let data = fs.readdirSync(path.join(this.abspath, Instance.paths.texture_packs));

		const pattern = new RegExp('erf$', 'i');

		return data.filter((file) => {
			return file.match(pattern);
		});
	}
	modules() {
		let data = fs.readdirSync(path.join(this.abspath, Instance.paths.modules));

		const pattern = new RegExp('(?:mod|rim)$', 'i');

		return data.filter((file) => {
			return file.match(pattern);
		});
	}
}

Instance.paths = {
	texture_packs: 'TexturePacks',
	override: 'Override',
	modules: 'Modules'
};
