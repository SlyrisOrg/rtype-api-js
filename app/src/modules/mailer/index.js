import alertMailer from "./alert";

export default deps => ({
  alert: alertMailer(deps),
});
