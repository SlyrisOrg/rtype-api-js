const isUserName = (deps, configs) => name => [
  deps.validator.isEmpty(name)
    && configs.payload.input.name.empty,
  deps.validator.isLength(name, { "min": 3, "max": 20 })
    && configs.payload.input.name.badFormat,
  deps.validator.isAlphanumeric(name)
    && configs.payload.input.name.badFormat
];

const isUserPassword = (deps, configs) => password => [
  deps.validator.isEmpty(password)
    && configs.payload.input.password.empty,
  deps.validator.isLength(password, { "min": 3, "max": 20 })
    && configs.payload.input.password.badFormat
];

const isUserEmail = (deps, configs) => email => [
  deps.validator.isEmpty(email)
    && configs.payload.input.email.empty,
  deps.validator.isEmail(email)
    && configs.payload.input.email.badFormat
];

export default (deps, configs) => inputs =>
  Object.keys(inputs)
    .reduce((acc, input) => {
      switch (input) {
        case "name":
          return [...acc, ...isUserName(deps, configs)(input)];
        case "password":
          return [...acc, ...isUserPassword(deps, configs)(input)];
        case "email":
          return [...acc, ...isUserEmail(deps, configs)(input)];
        default:
          return acc;
      }
    }, [])
    .filter(input => !!input);
