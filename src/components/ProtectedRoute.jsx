import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Navigate } from "react-router-dom";
import {CJPageLoader} from "../components/Cjloader";


export default function ProtectedRoute({ children }) {
    const [user, setUser] = useState(undefined); // undefined = loading

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data?.user || null);
        };
        getUser();
    }, []);

    // loading state
    if (user === undefined) {
        return (
            <CJPageLoader/>
        );
    }

    // not logged in → redirect
    if (!user) return <Navigate to="/login" replace />;

    // logged in → show page
    return children;
}