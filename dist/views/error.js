"use strict";Object.defineProperty(exports,"__esModule",{value:!0});exports.default=(id,response,options)=>({id,success:!1,payload:options.payload||response.internalError.payload,message:options.message||response.internalError.message,content:options.content||{},timestamp:new Date});