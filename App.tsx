import * as React from 'react';
import { MD3LightTheme as DefaultTheme, PaperProvider, Portal, useTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './src/components/mainNavigation';
import { AppProvider } from './src/providers/AppContext';
import { ModalWrapper } from './src/components/modalWrapper';

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
    return (
        <AppProvider>
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <MainNavigation />
                    <Portal>
                        <ModalWrapper theme={theme} />
                    </Portal>
                </NavigationContainer>
            </PaperProvider>
        </AppProvider>
    );
};

export default App;
