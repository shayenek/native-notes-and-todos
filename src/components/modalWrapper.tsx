import React from 'react';
import { useColorScheme } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

export const ModalWrapper = ({ theme, children }: { theme: any; children: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const containerStyle = {
        backgroundColor: isDarkMode ? theme.colors.darkTaskBg : theme.colors.lightTaskBg,
        padding: 20,
        margin: 20,
    };
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={containerStyle}
                theme={theme}
            >
                {children}
            </Modal>
        </Portal>
    );
};
