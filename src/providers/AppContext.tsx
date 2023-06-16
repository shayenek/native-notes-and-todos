import React, { createContext, useState } from 'react';

type AppContextType = {
    modalVisible: boolean;
    openModal: () => void;
    closeModal: () => void;
};

const defaultAppContextValue: AppContextType = {
    modalVisible: false,
    openModal: () => {},
    closeModal: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContextValue);

// Create a provider component
const AppProvider = ({ children }: { children: any }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        console.log('here');
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    // Provide the state and functions to the child components
    const contextValue = {
        modalVisible,
        openModal,
        closeModal,
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
