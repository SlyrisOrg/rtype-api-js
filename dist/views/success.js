"use strict";Object.defineProperty(exports,"__esModule",{value:!0});exports.default=(id,payload,message,options)=>({id,success:!0,payload:options.payload||payload.success,message:options.message||message.success,content:options.content||{},timestamp:new Date});