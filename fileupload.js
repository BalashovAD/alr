var busboy      = require('connect-busboy'),
    fs          = require('fs-extra'),
    streamifier = require('streamifier');

var debug = require('debug')('sniffer:md');
var path = require('path');

var allowTypes = Object.create(null, {
    '.fb2': {
        configurable: false,
        enumerable: true,
        value: true,
        writable: false
    }
});

module.exports = function(options) {
    options = options || {};

    return function(req, res, next) {
        return busboy(options)(req, res, function() {

            // If no busboy req obj, then no uploads are taking place
            if (!req.busboy)
                return next();

            req.files = null;

            req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
                req.body = req.body || {};
                debug('Field name = ' + fieldname);
                req.body[fieldname] = val;
            });

            req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                var buf = new Buffer(0);

                debug('Mime = ' + mimetype);
                debug('filename = ' + filename);

                if (!(path.extname(filename) in allowTypes))
                {
                    debug('Wrong extname: %s not  .fb2', filename);

                    req.files = {};
                    next();

                    return;
                }

                file.on('data', function(data) {
                    buf = Buffer.concat([buf, data]);
                    if (options.debug) {
                        return console.log('Uploading %s -> %s', fieldname, filename);
                    }
                });

                file.on('end', function() {
                    if (!req.files)
                        req.files = {};

                    return req.files[fieldname] = {
                        name: filename,
                        data: buf,
                        encoding: encoding,
                        mimetype: mimetype,
                        mv: function(path, callback) {
                            var fstream;
                            fstream = fs.createWriteStream(path);
                            streamifier.createReadStream(buf).pipe(fstream);
                            fstream.on('error', function(error) {
                                callback(error);
                            });
                            fstream.on('close', function() {
                                callback(null);
                            });
                        }
                    };
                });
            });

            req.busboy.on('finish', next);

            req.pipe(req.busboy);
        });
    };
};
