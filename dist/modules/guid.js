"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const s4=()=>Math.floor((1+Math.random())*65536).toString(16).substring(1);exports.default=()=>()=>`${s4()+s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;