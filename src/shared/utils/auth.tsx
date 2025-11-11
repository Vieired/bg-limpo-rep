export const checkIfAuthenticationIsRequired = () => {
    const currentUser = localStorage?.getItem("user") && typeof(localStorage.getItem("user")) === "string"
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

    if (currentUser?.stsTokenManager?.expirationTime < new Date().getTime()) { // compara timestamp
        localStorage.clear();
        document.location.reload();
    }
}