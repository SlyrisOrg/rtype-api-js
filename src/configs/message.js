export default () => {
  const system = {
    notFound: method =>
      `No ${method} entrypoint here`,
    success: "Requrest success",
    internalError: "Unexpected internal error",
    unvalidSignature: "Unvalid signature",
    unvalidToken: "Unvalid token",
    badRequest: "Bad JSON format",
  };

  const input = {
    emptyCredential: "Username or email is missing",
    emptyPseudo: "Empty pseudo",
    badFormatPseudo: "Bad pseudo format",
    alreadyTakenPseudo: "This pseudo already exist in current database state",
    emptyName: "Empty name",
    badFormatName: "Bad name format",
    alreadyTakenName: "This username already exist in current database state",
    emptyEmail: "Empty email",
    badFormatEmail: "Bad email format",
    alreadyTakenEmail: "This email already exist in current database state",
    emptyPassword: "Empty password",
    badFormatPassword: "Bad password format",
  };

  const user = {
    getUserData: "Fail to fetch user data",
    putUserData: "Fail to update data",
    postUserData: "Fail to create player",
    signinUser: "Couldn't signin",
    signupUser: "Couldn't signup",
  };

  return {
    ...system,
    ...input,
    ...user,
  };
};
