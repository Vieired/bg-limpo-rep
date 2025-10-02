export const getAccessToken = () => {
  const currentUser = localStorage?.getItem("user") && typeof(localStorage.getItem("user")) === "string"
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  return currentUser?.stsTokenManager?.accessToken as string;
}