export default () => ({
  "verifyObject": (objectToVerify) => {
    const errors = Object.keys(objectToVerify)
      .filter(configIndex => typeof objectToVerify[configIndex] === "undefined");

    if (errors.lenght) {
      throw new Error(`Error in configurations: ${errors}`);
    }

    return objectToVerify;
  }
});
