export default (deps) => {
  const userSchema = new deps.mongoose.Schema({
    new: { type: Boolean, default: true },
    email: { type: String, default: '', unique: true },
    pseudo: { type: String, default: '', unique: true },
    password: { type: String, default: '' },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Date, default: new Date() },

    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    google: { type: String, default: '' },
    tokens: { type: Array, default: [] },

    profile: {
      faction: { type: String, default: '' },
      level: { type: Number, default: 0 },
      gold: { type: Number, default: 0 },
      friends: { type: Array, default: [] },
      ship: {
        skin: { type: Number, default: 0 },
        stats: { type: Array, default: {} },
      },
    },
  }, {
    minimize: false,
    timestamps: true,
    collection: 'user',
  });

  userSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) {
      next();
      return;
    }

    try {
      const salt = await deps.bcrypt.genSalt(10);
      const hash = await deps.bcrypt.hash(this.password, salt, undefined);
      this.password = hash;
      next();
    } catch (err) {
      next(err);
    }
  });

  userSchema.methods.verifyPassword = async function verifyPassword(password) {
    return deps.bcrypt.compare(password, this.password);
  };

  return deps.mongoose.model('User', userSchema);
};
