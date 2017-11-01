"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _updateUserData=require("./updateUserData");var _updateUserData2=_interopRequireDefault(_updateUserData);var _getUserData=require("./getUserData");var _getUserData2=_interopRequireDefault(_getUserData);var _createUserData=require("./createUserData");var _createUserData2=_interopRequireDefault(_createUserData);var _signupUser=require("./signupUser");var _signupUser2=_interopRequireDefault(_signupUser);var _signinUser=require("./signinUser");var _signinUser2=_interopRequireDefault(_signinUser);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}const getClient=({mongo,configs})=>mongo.MongoClient.connect(configs.database.mongo.uri);exports.default=deps=>{const client=getClient(deps);return{getUserData:(0,_getUserData2.default)(deps,client),updateUserData:(0,_updateUserData2.default)(deps,client),createUserData:(0,_createUserData2.default)(deps,client),signupUser:(0,_signupUser2.default)(deps,client),signinUser:(0,_signinUser2.default)(deps,client)}};