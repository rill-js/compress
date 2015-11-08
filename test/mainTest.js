var fs       = require("fs");
var assert   = require("assert");
var Rill     = require("rill");
var agent    = require("./agent");
var compress = require("../server");

describe("Rill/Body", function () {
	after(agent.clear);
	var request = agent.create(
		Rill()
			.use(compress())
			.get("/", function (ctx) {
				ctx.res.body = fs.createReadStream(__filename);
			})
	);

	it("should compress with gzip", function (done) {
		request
			.get("/")
			.expect(200)
			.expect(function (res) {
				assert.equal(res.headers["content-encoding"], "gzip");
			})
			.end(done)
	});

	it("should compress with deflate", function (done) {
		request
			.get("/")
			.expect(200)
			.set("accept-encoding", "deflate")
			.expect(function (res) {
				assert.equal(res.headers["content-encoding"], "deflate");
			})
			.end(done)
	});

	it("should send identity", function (done) {
		request
			.get("/")
			.expect(200)
			.set("accept-encoding", "identity")
			.expect(function (res) {
				assert.equal(res.headers["content-encoding"], undefined);
			})
			.end(done)
	});
});

function respond (status, test) {
	return function (ctx) {
		ctx.res.status = status;
		if (typeof test === "function") test(ctx);
	};
}