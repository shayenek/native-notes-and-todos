import React, { ReactNode, createContext, useState } from 'react';

type AppContextType = {
    modalVisible: boolean;
    modalContent: ReactNode | null;
    openModal: (content: ReactNode) => void;
    closeModal: () => void;
    filteredByHash: string | null;
    setFilteredByHash: (hash: string | null) => void;
};

const defaultAppContextValue: AppContextType = {
    modalVisible: false,
    modalContent: null,
    openModal: () => {},
    closeModal: () => {},
    filteredByHash: null,
    setFilteredByHash: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContextValue);

// Create a provider component
const AppProvider = ({ children }: { children: any }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState<ReactNode | null>(null);
    const [hashFilter, applyHashFilter] = useState<string | null>(null);

    const openModal = (content: ReactNode) => {
        setModalContent(content);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalContent(null);
        setModalVisible(false);
    };

    const setFilteredByHash = (hash: string | null) => {
        if (hash === hashFilter) {
            applyHashFilter(null);
            return;
        }
        applyHashFilter(hash);
    };

    // Provide the state and functions to the child components
    const contextValue = {
        modalVisible,
        modalContent,
        openModal,
        closeModal,
        filteredByHash: hashFilter,
        setFilteredByHash,
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
