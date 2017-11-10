import isUserNameVerifier from "./isUserName";
import isUserPasswordVerifier from "./isUserPassword";
import isUserEmailVerifier from "./isUserEmail";
import isUserNicknameVerifier from "./isUserNickname";

export default deps => (
  async (inputs) => {
    const inputKeys = Object.keys(inputs);

    const input = await Promise.all(inputKeys
      .map((key) => {
        switch (key) {
          case "name":
            return isUserNameVerifier(deps)(inputs[key]);
          case "password":
            return isUserPasswordVerifier(deps)(inputs[key]);
          case "email":
            return isUserEmailVerifier(deps)(inputs[key]);
          case "nickname":
            return isUserNicknameVerifier(deps)(inputs[key]);
          default:
            return null;
        }
      }));

    return inputKeys
      .reduce((object, key, index) => ({
        ...object,
        [key]: input[index],
      }), {});
  }
);
