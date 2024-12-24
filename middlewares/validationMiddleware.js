const UserValidationSchema = {
  fullName: {
    isLength: {
      options: {
        min: 4,
        max: 16,
      },
      errorMessage: "Username must be at least 5 characters",
    },
    isString: {
      errorMessage: "Username must be a string!",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
    isString: {
      errorMessage: "Email must be a string!",
    },
  },
  password: {
    isLength: {
      options: {
        min: 5,
        max: 20,
      },
      errorMessage: "Password must be at least 5 characters",
    },
  },
};

module.exports = UserValidationSchema;
