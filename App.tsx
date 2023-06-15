import * as React from 'react';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import Main from './src/screens/Main';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        secondary: 'yellow',
    },
};

const App = () => {
    return (
        <PaperProvider theme={theme}>
            <Main />
        </PaperProvider>
    );
};

export default App;
