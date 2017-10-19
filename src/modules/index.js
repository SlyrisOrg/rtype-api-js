import * as deps from '../deps';
import * as configs from '../configs';

import mongoModule from './mongo';
import loggerModule from './logger';

export const logger = loggerModule(deps, configs);
export const mongo = mongoModule(deps, configs);
