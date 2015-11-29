var vary         = require("vary");
var bytes        = require("bytes");
var accepts      = require("accepts");
var compressible = require("compressible");
var checkType    = require("content-check");
var byteLength   = require("byte-length");
var statuses     = require("statuses");
var isType       = require("type-is").is;
var Stream       = require("stream");
var zlib         = require("zlib");

/**
 * Encoding methods supported.
 */
var encodingMethods = {
  gzip: zlib.createGzip,
  deflate: zlib.createDeflate
};

/**
 * Compression Middleware for Rill.
 *
 * @param {Object} opts
 * @return {Function}
 */
module.exports = function (opts) {
	// Apply default options.
	opts          = opts || {};
	var filter    = "filter" in opts ? opts.filter : compressible;
	var threshold = "threshold" in opts ? opts.threshold : "1kb";
	if (typeof threshold === "string") threshold = bytes(threshold);
	delete opts.filter;
	delete opts.threshold;

	return function compressBody (ctx, next) {
		var req = ctx.req;
		var res = ctx.res;
		vary(res.original, "Accept-Encoding");
		return next().then(function () {
			var body     = res.body;
			var type     = res.get("Content-Type") || checkType(body);
			var length   = Infinity;
			var isStream = body instanceof Stream;

			// support json
			if (isType(type, "json")) body = JSON.stringify(body);
			if (!isStream) length = res.get("Content-Length") || byteLength(body)

			// Check for reasons not to compress.
			if (!body) return;
			if (!type) return;
			if (req.method === "HEAD") return;
			if (statuses.empty[res.status]) return;
			if (res.get("Content-Encoding")) return;
			if (threshold && length < threshold) return;
			if (!filter(type)) return;

			// Check if browser supports encodings.
			var encoding = accepts(req.original).encoding("gzip", "deflate", "identity");
			if (!encoding) ctx.throw(406, "Supported encodings: gzip, deflate, identity");
			if (encoding === "identity") return;

			// Update headers.
			res.set("Content-Type", type);
			res.set("Content-Encoding", encoding);

			// Create compression stream.
			var stream = res.body = encodingMethods[encoding](opts);
			if (isStream) return body.pipe(stream);
			else stream.end(body);
		});
	};
};