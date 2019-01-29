const fs = require('fs')
const path = require('path');
var shell = require('shelljs');
var archiver = require('archiver');

const version = require('../src/Project/remote/version.json');
var ncp = require('ncp').ncp;

let src = '../src/Project/remote/';
let dest = '../update/version/' + version.version + '/remote/';
shell.rm('-rf', dest);
shell.mkdir('-p', dest);


let zipFolder = function (srcFolder, zipFilePath, callback) {
    var output = fs.createWriteStream(zipFilePath);
    var zipArchive = archiver('zip');

    output.on('close', function () {
        callback();
    });

    zipArchive.pipe(output);
    zipArchive.directory(srcFolder, path.basename(srcFolder));
    zipArchive.finalize(function (err, bytes) {
        if (err) {
            callback(err);
        }
    });
}

ncp(src, dest, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log(dest + ' done!');
    }

});

for (const s of version.files) {
    let srcDir = src + path.basename(s, '.zip');
    let destDir = dest + path.basename(s, '.zip');
    let destFile = dest + s;

    zipFolder(srcDir, destFile, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log(destFile + ' done!');
        }
    });
}


