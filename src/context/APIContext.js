import React, {createContext, useContext} from "react";

export const ApiContext = createContext();

export const ApiProvider = ({children}) => {
    const apiurl = process.env.EXPO_PUBLIC_APIURL;
    return (
        <ApiContext.Provider value={apiurl}>
            {children}
        </ApiContext.Provider>
    )
}

export const useApi = () => useContext(ApiContext);