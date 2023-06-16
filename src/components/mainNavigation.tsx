import * as React from 'react';
import { Text, View, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from '../screens/Main';

import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../../App';
import { useContext } from 'react';
import { AppContext } from '../providers/AppContext';
import { NewTaskForm } from './newTaskForm';

function SettingsScreen() {
    return (
        <View>
            <Text>Settings!</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export const MainNavigation = () => {
    const theme = useAppTheme();
    const isDarkMode = useColorScheme() === 'dark';

    const { openModal } = useContext(AppContext);

    const openTaskModal = () => {
        openModal(<NewTaskForm theme={theme} />);
    };

    return (
        <Tab.Navigator
            screenOptions={() => ({
                headerTitleStyle: {
                    color: isDarkMode ? theme.colors.darkTaskTitle : theme.colors.lightTaskTitle,
                },
                headerStyle: {
                    backgroundColor: isDarkMode
                        ? theme.colors.darkTaskBg
                        : theme.colors.lightTaskBg,
                },
                tabBarActiveTintColor: 'rgb(59,130,246)',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                    display: 'none',
                    fontSize: 12,
                },
                tabBarStyle: {
                    backgroundColor: isDarkMode
                        ? theme.colors.darkTaskBg
                        : theme.colors.lightTaskBg,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingHorizontal: 10,
                    height: 70,
                    borderTopColor: theme.colors.darkTaskDesc,
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0,
                        height: 12,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 5.0,
                    elevation: 18,
                },
                tabBarItemStyle: {
                    backgroundColor: isDarkMode
                        ? theme.colors.navItemDarkBg
                        : theme.colors.navItemLightBg,
                    margin: 4,
                    borderRadius: 10,
                },
            })}
        >
            <Tab.Screen
                name="Tasks view"
                component={Main}
                options={{
                    tabBarIcon: homeIcon,
                }}
            />
            <Tab.Screen
                name="Add Task"
                component={SettingsScreen}
                options={{
                    tabBarIcon: addTaskIcon,
                }}
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        openTaskModal();
                    },
                })}
            />
        </Tab.Navigator>
    );
};

const homeIcon = (props: { color: string; size: number }): React.ReactNode => {
    return <Icon name="home" size={props.size} color={props.color} />;
};

const addTaskIcon = (props: { color: string; size: number }): React.ReactNode => {
    return <Icon name="add-circle-outline" size={props.size} color={props.color} />;
};

export default MainNavigation;
