import React, { useContext } from 'react';
import { useColorScheme } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { AppContext } from '../providers/AppContext';

export const ModalWrapper = ({ theme }: { theme: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const { modalVisible, closeModal, modalContent } = useContext(AppContext);

    const containerStyle = {
        backgroundColor: isDarkMode ? theme.colors.darkTaskBg : theme.colors.lightTaskBg,
        padding: 20,
        margin: 20,
    };
    return (
        <Portal>
            <Modal
                visible={modalVisible}
                onDismiss={closeModal}
                contentContainerStyle={containerStyle}
                theme={theme}
            >
                {modalContent}
            </Modal>
        </Portal>
    );
};
