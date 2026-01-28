import Admin from 'pages/Admin';
import ContractList from 'pages/Admin/ContractList';
import { useEffect, useState } from 'react';
// import { checkJWT } from "utils/jwt";

const ProtectedRoute = () => {
    const [_authToken, setAuthToken] = useState<string | null>('');
    const authToken = localStorage.getItem('token');

    const isTokenExpired = (token: any) => {
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000; // 현재 시간
        return payload.exp < now;
    };

    const checkJWT = async () => {
        const token = localStorage.getItem('token');

        if (!token || isTokenExpired(token)) {
            localStorage.removeItem('token');
            return setAuthToken(null);
        }

        return setAuthToken(token);
    };

    useEffect(() => {
        checkJWT();
    }, []);
    return authToken || _authToken ? (
        <ContractList />
    ) : (
        <Admin setToken={setAuthToken} />
    );
};

export default ProtectedRoute;
