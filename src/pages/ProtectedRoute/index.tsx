import Admin from "pages/Admin";
import AdminBoard from "pages/Admin/AdminBoard";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
    const [_authToken, setAuthToken] = useState<string | null>('')
    const authToken = localStorage.getItem('token');
    useEffect(() => { setAuthToken(authToken) }, [])
    return authToken || _authToken ? <AdminBoard token={_authToken ?? authToken} setToken={setAuthToken} /> : <Admin setToken={setAuthToken} />
}

export default ProtectedRoute