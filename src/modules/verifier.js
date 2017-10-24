const isUserName = ({ validator }, configs) =>
  async (name) => {
    if (!name || validator.isEmpty(name)) {
      throw configs.payload.emptyName;
    }

    if (!validator.isLength(name, { min: 1, max: 25 })) {
      throw configs.payload.badFormatName;
    }

    if (!validator.isAlphanumeric(name)) {
      throw configs.payload.badFormatName;
    }

    return name;
  };

const isUserPassword = ({ validator }, configs) =>
  async (password) => {
    if (!password || validator.isEmpty(password)) {
      throw configs.payload.emptyPassword;
    }

    if (!validator.isLength(password, { min: 3, max: 20 })) {
      throw configs.payload.badFormatPassword;
    }

    return password;
  };

const isUserEmail = ({ validator }, configs) =>
  async (email) => {
    if (!email || validator.isEmpty(email)) {
      throw configs.payload.emptyEmail;
    }

    if (!validator.isEmail(email)) {
      throw configs.payload.badFormatEmail;
    }

    return email;
  };

const isUserPseudo = ({ validator }, configs) =>
  async (pseudo) => {
    if (!pseudo || validator.isEmpty(pseudo)) {
      throw configs.payload.emptyPseudo;
    }

    if (!validator.isLength(pseudo, { min: 1, max: 25 })) {
      throw configs.payload.badFormatPseudo;
    }

    if (!validator.isAlphanumeric(pseudo)) {
      throw configs.payload.badFormatPseudo;
    }

    return pseudo;
  };

export default (deps, configs) =>
  async (inputs) => {
    const pendingValues = Object.keys(inputs)
      .map((key) => {
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
      });

    const values = await Promise.all(pendingValues);

    return Object.keys(inputs).reduce((acc, key, i) => ({
      ...acc,
      [key]: values[i],
    }), {});
  };
