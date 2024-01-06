![image](https://github.com/erikyo/vite-block/assets/8550908/162f93ed-0427-4760-84c5-9b0db7836494)

# Vite Block for Wordpress

Vite Block is an experimental WordPress block development repository that explores the usage of Vite as a replacement for webpack, leveraging its advantages in ES module (ESM) support, faster build times, and efficient development workflows.

## Installation

To get started, clone this repository and navigate to the project directory.

```bash
git clone https://github.com/your-username/vite-block.git
cd vite-block
```

Install the dependencies using npm:

```bash
npm install
```

## Scripts

- `npm run packages-update`: Update WordPress packages using wp-scripts.
- `npm start`: Build the project with TypeScript and Vite, watching for changes.
- `npm run build`: Build the project with TypeScript and Vite.
- `npm run dev`: Run the development server with Vite.
- `npm run lint`: Lint the project using ESLint.
- `npm run wp-env:start`: Start the WordPress development environment.
- `npm run wp-env:stop`: Stop the WordPress development environment.
- `npm run wp-env:destroy`: Destroy the WordPress development environment.
- `npm run plugin-zip`: Package the plugin for distribution.

## DevDependencies

- `@types/node`: TypeScript definitions for Node.js.
- `@types/react` and `@types/react-dom`: TypeScript definitions for React.
- `@types/wordpress__block-editor` and `@types/wordpress__blocks`: TypeScript definitions for WordPress block editor and blocks.
- `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser`: ESLint plugin and parser for TypeScript.
- `@vitejs/plugin-react`: Vite plugin for React.
- `@wordpress/block-editor` and `@wordpress/blocks`: WordPress block editor and blocks packages.
- `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`: ESLint and plugins for React linting.
- `sass`: Sass compiler.
- `terser`: JavaScript minifier.
- `typescript`: TypeScript compiler.
- `vite`: Vite bundler for faster development.
- `vitest`: Test runner for Vite.

## Development Workflow

1. Run `npm start` to start the development server.
2. Develop your WordPress blocks using Vite's fast development environment.
3. Test and lint your code using `npm run dev` and `npm run lint`.
4. Package your plugin for distribution using `npm run plugin-zip`.

## Contributing

Feel free to contribute to this experimental project by opening issues, suggesting enhancements, or submitting pull requests. Your feedback and contributions are highly appreciated.

## License

This project is licensed under the GPL-2.0-or-later license. See the [LICENSE.md](LICENSE.md) file for details.

Thank you for checking out Vite Block! Happy coding!


<!-- Notes for me
To enable the HMR those files are needed 
`<!-- if development -->
<script type="module" src="http://localhost:5173/@vite/client"></script>
<script type="module" src="http://localhost:5173/main.js"></script>`

and this has to be appended before the above scripts
`<script type="module">
import RefreshRuntime from 'http://localhost:5173/@react-refresh'
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>`
-->
