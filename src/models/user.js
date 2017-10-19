export default (deps, configs) => {
  const userSchema = new deps.mongoose.Schema(configs.model.user, { timestamps: true });

  /**
   * Password hash middleware.
   */
  userSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) {
      next();
      return;
    }

    try {
      const salt = await deps.util.promisify(deps.bcrypt.genSalt)(10);
      const hash = await deps.util.promisify(deps.bcrypt.hash)(this.password, salt, undefined);
      this.password = hash;
    } catch (err) {
      next(err);
    }
  });

  userSchema.methods.comparePassword = async function comparePassword(candidatePassword, cb) {
    try {
      const isMatch = await deps.util.promisify(deps.bcrypt.compare)(candidatePassword, this.password);
      cb(null, isMatch);
    } catch (err) {
      cb(err, false);
    }
  };

  return deps.mongoose.model('User', userSchema);
};
