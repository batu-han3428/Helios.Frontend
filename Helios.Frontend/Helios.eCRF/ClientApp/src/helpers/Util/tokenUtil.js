import jwtDecode from "jwt-decode";

const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (e) {
        return null;
    }
};
const getToken = () => {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
};
const setTokenToCookie = (token) => {
    document.cookie = `token=${token}; path=/`;
};
export { decodeToken, getToken, setTokenToCookie };