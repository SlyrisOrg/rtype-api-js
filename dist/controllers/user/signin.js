"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _extends=Object.assign||function(target){var i,source;for(i=1;i<arguments.length;i++){source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};exports.default=({verifier,database,logger},configs)=>async(req,res,next)=>{try{if(!req.body.name&&!req.body.email){throw configs.message.emptyCredential}const credentials=req.body.name&&{name:req.body.name}||req.body.email&&{email:req.body.email};const body=await verifier(_extends({},credentials,{password:req.body.password}));const token=await database.signinUser(body);res.success({content:{token}})}catch(err){req.error=err;next()}};