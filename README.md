<h1 align="center">
  <!-- Logo -->
  <img src="https://raw.githubusercontent.com/rill-js/rill/master/Rill-Icon.jpg" alt="Rill"/>
  <br/>
  @rill/compress
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square" alt="API stability"/>
  </a>
  <!-- Standard -->
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard"/>
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/@rill/compress">
    <img src="https://img.shields.io/npm/v/@rill/compress.svg?style=flat-square" alt="NPM version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@rill/compress">
    <img src="https://img.shields.io/npm/dm/@rill/compress.svg?style=flat-square" alt="Downloads"/>
  </a>
  <!-- Gitter Chat -->
  <a href="https://gitter.im/rill-js/rill">
    <img src="https://img.shields.io/gitter/room/rill-js/rill.svg?style=flat-square" alt="Gitter Chat"/>
  </a>
</h1>

Isomorphic response body compression middleware for Rill using gzip or deflate if available.

# Installation

```console
npm install @rill/compress
```

# Example

```javascript
const app = require('rill')()
const compress = require('@rill/compress')

app.use(compress())
app.use(({ req, res }, next)=> {
	// Send this file.
	// Supported encodings: gzip, deflate and identity.
	res.body = fs.createReadStream(__filename)
})
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
