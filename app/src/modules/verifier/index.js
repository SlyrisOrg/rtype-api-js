import userVerifier from "./user";
import allVerify from "./all";

export default deps => ({
  all: allVerify(deps),
  user: userVerifier(deps),
});
