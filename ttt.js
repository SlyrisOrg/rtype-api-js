const bcrypt = require('bcrypt');

const test = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt, undefined);

  return hash;
};

test('>62t~G\/s<{cjh5{')
  .then(data => console.log(data));
