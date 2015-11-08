# Rill Compress
Isomorphic response body compression middleware.

# Installation

#### Npm
```console
npm install @rill/compress
```

# Example

```javascript
const app      = require("rill")();
const compress = require("@rill/compress");

app.use(compress());
app.use(function ({ req, res }, next) {
	// Send this file.
	// Supported encodings: gzip, deflate and identity.
	res.body = fs.createReadStream(__filename);
});
```

# API Options / Defaults.

```javascript
{
	// The minimum response size to compress.
	threshold: "1kb",
	// Optional function to filter compressed responses by content-type.
	filter: function (contentType) { ... }
}
```


### Contributions

* Use gulp to run tests.

Please feel free to create a PR!
