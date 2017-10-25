const isUserName = ({ validator }, configs) => (
  async (name) => {
    if (!name || validator.isEmpty(name)) {
      throw configs.message.emptyName;
    }

    if (!validator.isLength(name, { min: 1, max: 25 })) {
      throw configs.message.badFormatName;
    }

    if (!validator.isAlphanumeric(name)) {
      throw configs.message.badFormatName;
    }

    return name;
  }
);

const isUserPassword = ({ validator }, configs) => (
  async (password) => {
    if (!password || validator.isEmpty(password)) {
      throw configs.message.emptyPassword;
    }

    if (!validator.isLength(password, { min: 3, max: 20 })) {
      throw configs.message.badFormatPassword;
    }

    return password;
  }
);

const isUserEmail = ({ validator }, configs) => (
  async (email) => {
    if (!email || validator.isEmpty(email)) {
      throw configs.message.emptyEmail;
    }

    if (!validator.isEmail(email)) {
      throw configs.message.badFormatEmail;
    }

    return email;
  }
);

const isUserPseudo = ({ validator }, configs) => (
  async (pseudo) => {
    if (!pseudo || validator.isEmpty(pseudo)) {
      throw configs.message.emptyPseudo;
    }

    if (!validator.isLength(pseudo, { min: 1, max: 25 })) {
      throw configs.message.badFormatPseudo;
    }

    if (!validator.isAlphanumeric(pseudo)) {
      throw configs.message.badFormatPseudo;
    }

    return pseudo;
  }
);

const verifyAll = (deps, configs) =>
  async inputs => (
    Promise.all(Object
      .keys(inputs)
      .map((key) => {
        if (typeof inputs[key] === "object") {
          return verifyAll(deps, configs)(inputs[key]);
        }

        switch (key) {
          case "name": {
            return isUserName(deps, configs)(inputs[key]);
          }
          case "password": {
            return isUserPassword(deps, configs)(inputs[key]);
          }
          case "email": {
            return isUserEmail(deps, configs)(inputs[key]);
          }
          case "pseudo": {
            return isUserPseudo(deps, configs)(inputs[key]);
          }
          default: {
            return Promise.resolve(inputs[key]);
          }
        }
      }))
  );

export default (deps, configs) => (
  async (inputs) => {
    const values = await verifyAll(deps, configs);

    return Object
      .keys(inputs)
      .reduce((acc, key, i) => ({
        ...acc,
        [key]: values[i],
      }), {});
  }
);
