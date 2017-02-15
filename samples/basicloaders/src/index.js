import 'expose-loader?$!jquery';
import {hello, addLogo} from './libs/lib';
import {test} from 'imports-loader?$=jquery!./libs/lib2';
import {test2} from './libs/lib3';

import './sass/main.sass';
import "style-loader/url!file-loader?name=css/[name].[ext]!./css/main.css";
import './css/cssResolvedByFileloader.css';

hello('index');
addLogo();
test();
test2();




