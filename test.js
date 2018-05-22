// workaround babel issue:
const lotor = require('./lib/lotor').default;

console.log(lotor);

//const bif = new lotor.archive.bif('./');
const chitin = new lotor.archive.Chitin('/Applications/Wineskin/KotOR II FS.app/Contents/Resources/drive_c/Program Files/SWKotOR2');
console.log(chitin);
for (const file of chitin.files) {
  file.bif = new lotor.archive.BIF(file.abspath, file.files);
  //console.log(file);
  //file.bif.extract('.', 'amb_comp_05.wav');
	/*
  if (file.filename == 'sounds.bif') {
    file.bif.extract('./output');
  }
  if (file.filename == '2da.bif') {
    file.bif.extract('./2da');
  }
	*/
}

const gff1 = new lotor.game.GFF('templates/plc_sign.utp');
console.log(gff1.json());
console.log(gff1.find('templateresref'));

const arr = new lotor.game.TwoDA('/Applications/Wineskin/KotOR II FS.app/Contents/Resources/drive_c/Program Files/SWKotOR2/Override/placeables.2da');
console.log(arr);
/*
const tpa = new lotor.archive.erf('/Applications/Wineskin/KotOR II FS.app/Contents/Resources/drive_c/Program Files/SWKotOR2/TexturePacks/swpc_tex_tpb.erf')
console.log(tpa);
//tpa.extract('./output', 'c_condrdlb.tpc');
tpa.extract('./output');
*/
