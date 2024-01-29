import Admin from "pages/Admin";
import AdminBoard from "pages/Admin/AdminBoard";
import { useState } from "react";

const ProtectedRoute = () => {
    const [_authToken, setAuthToken] = useState<string | null>('')
    const authToken = localStorage.getItem('token');
    return authToken || _authToken ? <AdminBoard /> : <Admin setToken={setAuthToken} />
}

export default ProtectedRoute