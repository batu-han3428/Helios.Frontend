import { decodeToken } from "../Util/tokenUtil";
import { getLocalStorage, removeLocalStorage } from '../local-storage/localStorageProcess';



export const onLogin = () => {

    let token = getLocalStorage("accessToken");

    if (token !== null) {
        var auth = decodeToken(token);
        let exp = new Date(auth.exp * 1000);

        if (exp < new (Date)) {
            return false;
        }

        let mainRoles = [...auth.roles];
        let roles = [];
        mainRoles.forEach(role => roles.push(role));

        return {
            token: token,
            name: auth.name,
            roles: roles,
            isAuthenticated: auth.isAuthenticated,
            exp: exp.toISOString(),
            mail: auth.mail,
            userId: auth.userId,
            tenantId: auth.tenantId,
            studyId: auth.studyId
        };
    }
    return false;
};

export const onLogout = (navigate, isSessionMessage = false) => {
    removeLocalStorage("accessToken");
    if (isSessionMessage) {
        navigate("/login", { state: { message: "Session expired, please login again." }});
    } else {
        navigate("/login");
    }
};