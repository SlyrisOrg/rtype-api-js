const bcrypt = require('bcrypt');

const createSignature = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt, undefined);
    return hash;
  } catch (err) {
    return '';
  }
};

createSignature('eAVZepqfXsrSW6LVjTuqb3W3CHsf9mAUa5776cGZ2hLGzztK4PAT5gkJE52h')
  .then(data => console.log(data));