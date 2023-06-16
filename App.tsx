import * as React from 'react';
import {
    MD3LightTheme as DefaultTheme,
    Modal,
    PaperProvider,
    Portal,
    Text,
    useTheme,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './src/components/mainNavigation';

import { useColorScheme } from 'react-native';
import { createTask } from './src/api/tasks';
import { NewTaskForm } from './src/components/newTaskForm';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        lightBg: '#f4f6f8',
        lightTaskBg: '#ffffff',
        lightTaskTitle: '#030910',
        lightTaskDesc: '#7c7e82',
        darkBg: '#101213',
        darkTaskBg: '#1d1f20',
        darkTaskTitle: '#e0e2e4',
        darkTaskDesc: '#7e8083',
        navItemLightBg: '#ecf0f3',
        navItemDarkBg: '#17181c',
        lightBorderColor: '#ecf0f3',
        darkBorderColor: '#2b3031',
    },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [visible, setVisible] = React.useState(false);
    const [modalContent, setModalContent] = React.useState(<Text>Modal Content</Text>);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {
        backgroundColor: isDarkMode ? theme.colors.darkTaskBg : theme.colors.lightTaskBg,
        padding: 20,
        margin: 20,
    };

    const handleFormSubmit = async (values: any) => {
        try {
            await createTask(values);
            hideModal();
            console.log('task created');
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenModal =
        ({ children }: { children: any }) =>
        () => {
            setModalContent(children);
            showModal();
        };

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <MainNavigation
                    openNewTaskModal={handleOpenModal({
                        children: (
                            <NewTaskForm theme={theme} handleNewTaskSubmit={handleFormSubmit} />
                        ),
                    })}
                />
                <Portal>
                    <Modal
                        visible={visible}
                        onDismiss={hideModal}
                        contentContainerStyle={containerStyle}
                        theme={theme}
                    >
                        {modalContent}
                    </Modal>
                </Portal>
            </NavigationContainer>
        </PaperProvider>
    );
};

export default App;
