import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { useState } from 'react'

import './style.scss';

/* Block settings */
import blockConfig from '../block.json';
import viteLogo from "../public/vite.svg";
import reactLogo from "./assets/react.svg";

const props = {
	className: 'dark-mode-switch',
};

// Register the custom block
// @ts-ignore
registerBlockType( blockConfig.name, {
	...blockConfig,

	edit() {
    const [count, setCount] = useState(0)
    return ( <div { ...useBlockProps( props ) }>
        <div style={{ width: '100%', height: "50vh", background: '#ccc' }}>
          <a href="https://vitejs.dev" target="_blank" rel={'noopener'} >
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel={'noopener'} >
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
    </div> );
	},

	save() {

    return <div { ...useBlockProps.save( props ) }>
        <div style={{ width: '100%', height: "50vh", background: '#ccc' }}>
          <a href="https://vitejs.dev" target="_blank" rel={'noopener'} >
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel={'noopener'} >
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
    </div>;
	},
} );
