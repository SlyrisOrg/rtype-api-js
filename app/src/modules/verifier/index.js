import userVerifier from "./user";
import profileVerifier from "./profile";

export default deps => ({
  user: userVerifier(deps),
  profile: profileVerifier(deps),
});
