export default () => {
  const system = {
    success: 0,
    notFound: 101,
    internalError: 102,
    unvalidSignature: 103,
    unvalidToken: 104,
    badRequest: 105,
  };

  const input = {
    emptyCredential: 1101,
    emptyPseudo: 201,
    badFormatPseudo: 202,
    alreadyTakenPseudo: 203,
    emptyName: 301,
    badFormatName: 302,
    alreadyTakenName: 303,
    emptyEmail: 401,
    badFormatEmail: 402,
    alreadyTakenEmail: 403,
    emptyPassword: 501,
    badFormatPassword: 502,
  };

  const user = {
    getUserData: 601,
    putUserData: 701,
    postUserData: 801,
    signinUser: 901,
    signupUser: 1001,
  };

  return {
    ...system,
    ...input,
    ...user,
  };
};
