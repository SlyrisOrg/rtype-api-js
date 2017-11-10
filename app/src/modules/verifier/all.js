import verifyUser from "./user";

export default () => (
  async inputs => ({
    ...await verifyUser(inputs),
  })
);
