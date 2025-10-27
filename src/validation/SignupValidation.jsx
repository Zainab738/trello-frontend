import * as Yup from "yup";

const SignupValidation = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  profilePic: Yup.mixed().test(
    "is-valid-type",
    "Only .jpg, .jpeg, or .png files are allowed",
    function (value) {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }
  ),
});

export default SignupValidation;
