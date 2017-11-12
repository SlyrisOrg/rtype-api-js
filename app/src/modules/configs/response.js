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
  emptyNickname: {
    payload: 201,
    message: "Empty nickname",
  },
  badFormatNickname: {
    payload: 202,
    message: "Bad nickname format",
  },
  alreadyTakenNickname: {
    payload: 203,
    message: "This nickname already exist in current database state",
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
  emptyLevel: {
    payload: 1201,
    message: "Empty level",
  },
  badFormatLevel: {
    payload: 1202,
    message: "Bad level format",
  },
  emptyFaction: {
    payload: 1301,
    message: "Empty faction",
  },
  badFormatFaction: {
    payload: 1302,
    message: "Bad faction format",
  },
  emptyExperience: {
    payload: 1401,
    message: "Empty experience",
  },
  badFormatExperience: {
    payload: 1402,
    message: "Bad experience format",
  },
  emptyIcon: {
    payload: 1501,
    message: "Empty icon",
  },
  badFormatIcon: {
    payload: 1502,
    message: "Bad icon format",
  },

  readUserData: {
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
