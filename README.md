<div align="center">
  <h1>your-package</h1>
  <p><em>One-line description of what this package does.</em></p>
</div>

---


[![npm version](https://img.shields.io/npm/v/your-package.svg?style=flat-square)](https://www.npmjs.com/package/your-package)

## Install

```bash
npm install your-package
pnpm add your-package
yarn add your-package
```

## Usage

```ts
import { yourFunction } from 'your-package'

const result = yourFunction({
  input: 'value',
  options: {},
})

console.log(result)
// → { success: true, data: '...' }
```

## API

### `yourFunction(options)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `input` | `string` | — | Required input value |
| `timeout` | `number` | `5000` | Timeout in ms |
| `debug` | `boolean` | `false` | Enable debug logs |

Returns: `Promise`

## Contributing

```bash
git clone https://github.com/your-username/your-package
cd your-package
pnpm install
pnpm test
```

## License

MIT © [Your Name](https://github.com/your-username)