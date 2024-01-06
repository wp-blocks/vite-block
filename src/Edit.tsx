import {useState} from "react";
import {useBlockProps} from "@wordpress/block-editor";
import viteLogo from "../public/vite.svg";
import reactLogo from "./assets/react.svg";

export default function Edit() {
    const [count, setCount] = useState(0)
    return ( <div { ...useBlockProps( {
        className: 'vite-block',
    } ) }>
        <div className={'logo-wrapper'}>
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
                Edit <code>src/index.tsx</code> and save to test HMR or enable it in this <a href={'https://vitejs.dev/guide/backend-integration.html'}>way</a>
            </p>
        </div>
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
    </div> )
}
