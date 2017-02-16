import {hello, addLogo} from './libs/lib';

// Using imports loader to set lib2 module dependency
import {changeLogoSize} from 'imports-loader?$=jquery!./libs/lib2';

// Exposing jQuery into window.$ for lib3 module
import 'expose-loader?$!jquery';
import {addText} from './libs/lib3';

// Classic Sass compiling
import './sass/main.sass';

// Not loaded by css loader, but only style loader and file loader thus it is handled as file
import "style-loader/url!file-loader?name=css/[name].[ext]!./css/main.css";

// Loaded via css loader which allows file-loader to resolve @import and url()
import './css/cssResolvedByFileloader.css';

// Trying to use coffee script
import {coffee} from './coffee/main.coffee';

hello('index');
addLogo();
changeLogoSize();
addText();

coffee();




