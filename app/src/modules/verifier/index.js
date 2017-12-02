import userVerifier from "./user";
import profileVerifier from "./profile";
import shipVerifier from "./ship";

const allVerifier = deps =>
  async (data) => {

    const user = data && await userVerifier(deps)(data);
    const profile = data.profile && await profileVerifier(deps)(data.profile);
    const ship = data.ship && await shipVerifier(deps)(data.ship);

    return {
      ...user,
      profile,
      ship,
    };
  };

export default deps => ({
  all: allVerifier(deps),
  user: userVerifier(deps),
  ship: shipVerifier(deps),
  profile: profileVerifier(deps),
});
