import isShipDefenseVerifier from "./isShipDefense";
import isShipHealthVerifier from "./isShipHealth";
import isShipAttackVerifier from "./isShipAttack";
import isShipMoveSpeedVerifier from "./isShipMoveSpeed";

export default deps => (
  async (inputs) => {
    const inputsToVerify = Object.entries(inputs);

    const input = await Promise.all(inputsToVerify
      .map(([key, input]) => {
        switch (key) {
          case "defense":
            return isShipDefenseVerifier(deps)(input);
          case "health":
            return isShipHealthVerifier(deps)(input);
          case "attack":
            return isShipAttackVerifier(deps)(input);
          case "moveSpeed":
            return isShipMoveSpeedVerifier(deps)(input);
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