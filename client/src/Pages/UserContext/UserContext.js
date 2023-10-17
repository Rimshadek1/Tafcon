import axios from "axios";
import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [username, setLoggedInUsername] = useState(null);
    const [id, setId] = useState(null); // Fix the variable name here
    useEffect(() => {
        axios.get('http://localhost:3001/profile').then(response => {
            setId(response.data.userData.id);
            setLoggedInUsername(response.data.userData.number);
            console.log(response.data.userData);
        })
    }, [])
    return (
        <UserContext.Provider value={{ username, setLoggedInUsername, id, setId }}> {/* Fix the variable name here as well */}
            {children}
        </UserContext.Provider>
    );
}


UserContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};