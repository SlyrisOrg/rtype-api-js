"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};const isUserName=({validator},configs)=>async name=>{if(!name||validator.isEmpty(name)){throw configs.message.emptyName}if(!validator.isLength(name,{min:1,max:25})){throw configs.message.badFormatName}if(!validator.isAlphanumeric(name)){throw configs.message.badFormatName}return name};const isUserPassword=({validator},configs)=>async password=>{if(!password||validator.isEmpty(password)){throw configs.message.emptyPassword}if(!validator.isLength(password,{min:3,max:20})){throw configs.message.badFormatPassword}return password};const isUserEmail=({validator},configs)=>async email=>{if(!email||validator.isEmpty(email)){throw configs.message.emptyEmail}if(!validator.isEmail(email)){throw configs.message.badFormatEmail}return email};const isUserNickname=({validator},configs)=>async nickname=>{if(!nickname||validator.isEmpty(nickname)){throw configs.message.emptyNickname}if(!validator.isLength(nickname,{min:1,max:25})){throw configs.message.badFormatNickname}if(!validator.isAlphanumeric(nickname)){throw configs.message.badFormatNickname}return nickname};const verifyAll=(deps,configs)=>async inputs=>Promise.all(Object.keys(inputs).filter(key=>{if(typeof inputs[key]==="object"){return verifyAll(deps,configs)(inputs[key])}switch(key){case"name":{return isUserName(deps,configs)(inputs[key])}case"password":{return isUserPassword(deps,configs)(inputs[key])}case"email":{return isUserEmail(deps,configs)(inputs[key])}case"nickname":{return isUserNickname(deps,configs)(inputs[key])}default:{return!1}}}).reduce((obj,key)=>_extends({},obj,{[key]:inputs[key]}),{}));exports.default=(deps,configs)=>async inputs=>verifyAll(deps,configs)(inputs);