import { registerBlockType } from '@wordpress/blocks';

/* Block settings */
import blockConfig from '../block.json';

/* Block styles */
import './style.scss';

/* Block components */
import Edit from "./Edit";
import Save from './Save';

// Register the custom block
// @ts-ignore
registerBlockType( blockConfig.name, {
  ...blockConfig,
    edit: Edit,
    save: Save,
} );
