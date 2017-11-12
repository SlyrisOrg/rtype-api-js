import isUserNameVerifier from "./isUserName";
import isUserPasswordVerifier from "./isUserPassword";
import isUserEmailVerifier from "./isUserEmail";
import isUserNicknameVerifier from "./isUserNickname";
import isUserIconVerifier from "./isUserIcon";

export default deps => (
  async (inputs) => {
    const inputsToVerify = Object.entries(inputs);

    const input = await Promise.all(inputsToVerify
      .map(([key, input]) => {
        switch (key) {
          case "name":
            return isUserNameVerifier(deps)(input);
          case "password":
            return isUserPasswordVerifier(deps)(input);
          case "email":
            return isUserEmailVerifier(deps)(input);
          case "nickname":
            return isUserNicknameVerifier(deps)(input);
          case "icon":
            return isUserIconVerifier(deps)(input);
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
