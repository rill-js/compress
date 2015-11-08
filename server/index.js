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

	if (typeof opts.threshold === "string") {
		opts.threshold = bytes(opts.threshold);
	}

	return function compressBody (ctx, next) {
		var req = ctx.req;
		var res = ctx.res;

		vary(res.original, "Accept-Encoding");

		return next().then(function () {
			var body     = res.body;
			var length   = res.get("Content-Length");
			var type     = res.get("Content-Type");
			var isStream = body instanceof Stream;

			// Check content length.
			if (!length) res.set("Content-Length", length = byteLength(body));
			// Check content type.
			if (!type) res.set("Content-Type", type = checkType(body));

			// Check for reasons not to compress.
			if (!body || !type) return;
			if (res.compress === false) return;
			if (req.method === "HEAD") return;
			if (statuses.empty[res.status]) return;
			if (res.get("Content-Encoding")) return;
			// Force compression or implied.
			if (!(res.compress === true || filter(type))) return;

			// Check allowed encodings.
			var encoding = accepts(req.original).encoding("gzip", "deflate", "identity");
			if (!encoding) ctx.throw(406, "Supported encodings: gzip, deflate, identity");
			if (encoding === "identity") return;

			// json
			if (isType(type, "json")) body = res.body = JSON.stringify(body);
			// threshold
			if (!isStream && threshold && length < threshold) return;

			res.set("Content-Encoding", encoding);
			res.remove("Content-Length");

			var stream = res.body = encodingMethods[encoding](opts);
			// Start compression stream.
			if (isStream) body.pipe(stream);
			else stream.end(body);
		});
	};
};