import * as deps from '../deps';
import * as models from '../models';
import * as modules from '../modules';

import userController from './user';

export const user = userController(deps, modules, models);
