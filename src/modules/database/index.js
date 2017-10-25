import updateUserData from "./updateUserData";
import getUserData from "./getUserData";
import createUserData from "./createUserData";
import signupUser from "./signupUser";
import signinUser from "./signinUser";

const getClient = ({
  mongo,
  configs,
}) => (
  mongo.MongoClient.connect(configs.database.mongo.uri)
);

export default (deps) => {
  const client = getClient(deps);

  return {
    getUserData: getUserData(deps, client),
    updateUserData: updateUserData(deps, client),
    createUserData: createUserData(deps, client),
    signupUser: signupUser(deps, client),
    signinUser: signinUser(deps, client),
  };
};
