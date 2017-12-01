import userVerifier from "./user";
import profileVerifier from "./profile";
import shipVerifier from "./ship";

const allVerifier = (data) => {
  const user = await userVerifier(deps)(data);
  return {
    ...user,
    profile: await profileVerifier(deps)(data.profile),
    ship: await shipVerifier(deps)(data.ship),
  }
};

export default deps => ({
  all: allVerifier(deps),
  user: userVerifier(deps),
  ship: shipVerifier(deps),
  profile: profileVerifier(deps),
});
