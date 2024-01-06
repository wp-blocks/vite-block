import { registerBlockType } from '@wordpress/blocks';

/* Block settings */
import blockConfig from '../block.json';

import './style.scss';
import Edit from "./Edit.tsx";
import Save from './Save.tsx';

// Register the custom block
// @ts-ignore
registerBlockType( blockConfig.name, {
  ...blockConfig,
    edit: Edit,
    save: Save,
} );
