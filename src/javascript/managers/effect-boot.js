import '../../styles/effects.css';
import {installBait} from './inspect-bait.js';
import { director } from './director.js';
import { runPageVisit } from './page-visit.js';

runPageVisit();
installBait();
director.start();