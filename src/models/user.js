export default (deps, configs) => {
  const hashPassword = (password) => {
    const salt = deps.bcrypt.genSaltSync(10);
    const hash = deps.bcrypt.hashSync(password, salt);

    return hash;
  };

  const verifyPassword = (challenger, password) =>
    deps.bcrypt.compareSync(challenger, password);

  return function User(user) {
    this.data = Object.freeze(deps.helper.verifyObject({
      ...configs.model.user,
      ...user,
      "createdAt": user.createdAt || new Date(),
      "modifiedAt": new Date()
    }));

    return {
      "verifyPassword": challenger =>
        verifyPassword(challenger, this.data.password),
      "hashPassword": () =>
        new User({
          ...this.data,
          "password": hashPassword(this.data.password)
        }),
      "get": (key) => {
        if (key) {
          return this.data[key];
        }

        const { _id, ...sanitizeData } = this.data;

        return sanitizeData;
      },
      "set": (elements) => {
        const elementArray = Array.isArray(elements)
          ? elements
          : [elements];

        return new User({
          ...this.data,
          ...elementArray.reduce((value, acc, key) => ({
            ...acc,
            [key]: value
          }), {})
        });
      }
    };
  };
};
