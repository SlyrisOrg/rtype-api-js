"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _database=require("./database");var _database2=_interopRequireDefault(_database);var _mailer=require("./mailer");var _mailer2=_interopRequireDefault(_mailer);var _response=require("./response");var _response2=_interopRequireDefault(_response);var _server=require("./server");var _server2=_interopRequireDefault(_server);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}exports.default=()=>({server:(0,_server2.default)(),database:(0,_database2.default)(),response:(0,_response2.default)(),mailer:(0,_mailer2.default)()});