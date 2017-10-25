export default () => ({
  success: {
    payload: 0,
    message: "Requrest success",
  },
  notFound: {
    payload: 101,
    message: "No entrypoint here",
  },
  internalError: {
    payload: 102,
    message: "Unexpected internal error",
  },
  unvalidSignature: {
    payload: 103,
    message: "Unvalid signature",
  },
  unvalidToken: {
    payload: 104,
    message: "Unvalid token",
  },
  badRequest: {
    payload: 105,
    message: "Bad JSON format",
  },

  emptyCredential: {
    payload: 1101,
    message: "Username or email is missing",
  },
  emptyPseudo: {
    payload: 201,
    message: "Empty pseudo",
  },
  badFormatPseudo: {
    payload: 202,
    message: "Bad pseudo format",
  },
  alreadyTakenPseudo: {
    payload: 203,
    message: "This pseudo already exist in current database state",
  },
  emptyName: {
    payload: 301,
    message: "Empty name",
  },
  badFormatName: {
    payload: 302,
    message: "Bad name format",
  },
  alreadyTakenName: {
    payload: 303,
    message: "This username already exist in current database state",
  },
  emptyEmail: {
    payload: 401,
    message: "Empty email",
  },
  badFormatEmail: {
    payload: 402,
    message: "Bad email format",
  },
  alreadyTakenEmail: {
    payload: 403,
    message: "This email already exist in current database state",
  },
  emptyPassword: {
    payload: 501,
    message: "Empty password",
  },
  badFormatPassword: {
    payload: 502,
    message: "Bad password format",
  },

  getUserData: {
    payload: 601,
    message: "Fail to fetch user data",
  },
  putUserData: {
    payload: 701,
    message: "Fail to update data",
  },
  postUserData: {
    payload: 801,
    message: "Fail to create player",
  },
  signinUser: {
    payload: 901,
    message: "Couldn't signin",
  },
  signupUser: {
    payload: 1001,
    message: "Couldn't signup",
  },
});
