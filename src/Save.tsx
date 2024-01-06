import {useBlockProps} from "@wordpress/block-editor";
import viteLogo from "../public/vite.svg";
import reactLogo from "./assets/react.svg";


export default function Save() {
    return <div { ...useBlockProps.save( {
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
    </div>
}
