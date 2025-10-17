export const handleerror = (error, setError, navigate) => {
  if (!error.response) {
    setError("Network error: " + error.message);
    return;
  }

  const { status, data } = error.response;

  let message = "Something went wrong!";
  if (status === 500) {
    message = data?.error?.errorResponse?.errmsg || "Server error";
  } else if (status === 401) {
    console.log("401");
    localStorage.removeItem("token");
    navigate("/Login");
    return;
  } else if (status === 400) {
    if (Array.isArray(data?.error?.errors)) {
      message = data.error.errors.join(" , ");
    } else {
      message = data?.message || data?.error?.message || "Validation failed";
    }
  } else {
    message = data?.message || message;
  }

  setError(message);
};
