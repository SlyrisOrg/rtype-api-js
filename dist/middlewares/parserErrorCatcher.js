"use strict";Object.defineProperty(exports,"__esModule",{value:!0});exports.default=({configs})=>async(error,req,res,next)=>{if(error instanceof SyntaxError){res.render("error",configs.response.badRequest.payload);return}next()};