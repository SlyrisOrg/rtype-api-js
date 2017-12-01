import isProfileExperienceVerifier from "./isProfileExperience";
import isProfileFactionVerifier from "./isProfileFaction";
import isProfileLevelVerifier from "./isProfileLevel";
import isProfileGoldVerifier from "./isProfileGold";
import isProfileShipVerifier from "./isProfileShip";

export default deps => (
  async (inputs) => {
    const inputsToVerify = Object.entries(inputs);

    const input = await Promise.all(inputsToVerify
      .map(([key, input]) => {
        switch (key) {
          case "experience":
            return isProfileExperienceVerifier(deps)(input);
          case "faction":
            return isProfileFactionVerifier(deps)(input);
          case "level":
            return isProfileLevelVerifier(deps)(input);
          case "gold":
            return isProfileLevelVerifier(deps)(input);
          case "ship":
            return isProfileShipVerifier(deps)(input);
          default:
            return null;
        }
      }));

    return inputsToVerify
      .reduce((object, [key], index) => ({
        ...object,
        [key]: input[index],
      }), {});
  }
);
