"use strict";Object.defineProperty(exports,"__esModule",{value:!0});exports.default=(id,message,options)=>({id,success:!0,payload:options.payload||message.success.payload,message:options.message||message.success.message,content:options.content||{},timestamp:new Date});