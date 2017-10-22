export default (deps) => {
  const userSchema = new deps.mongoose.Schema({
    new: { type: Boolean, default: true },
    email: { type: String, unique: true },
    pseudo: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,

    profile: {
      faction: String,
      level: Number,
      gold: Number,
      friends: Array,
    },

    ship: {
      skin: deps.mongoose.Schema.Types.ObjectId,
      stats: Object,
    },
  }, {
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
