import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    useColorScheme,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';
import Config from 'react-native-config';

import TaskItem from '../components/taskitem';

import { Task } from '../../src/utils/types';
import { useAppTheme } from '../../App';

import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';
import { getTasksData } from '../api/tasks';
const Main = () => {
    const theme = useAppTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? theme.colors.darkBg : theme.colors.lightBg,
    };

    const [isLoading, setLoading] = useState(true);
    const [tasksData, setTasksData] = useState<Task[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        handleGetTaskData().then(() => setRefreshing(false));
    }, []);

    const handleGetTaskData = async () => {
        try {
            const data = await getTasksData();
            setTasksData(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleGetTaskData();
    }, []);

    useEffect(() => {
        const pusher = Pusher.getInstance();
        const connectPusher = async () => {
            try {
                await pusher.init({
                    apiKey: Config.PUSHER_API_KEY!,
                    cluster: Config.PUSHER_CLUSTER!,
                });

                await pusher.connect();
                await pusher.subscribe({
                    channelName: 'user-shayenek',
                    onEvent: (event: PusherEvent) => {
                        console.log(`Event received: ${event}`);
                        try {
                            handleGetTaskData();
                        } catch (error) {
                            console.error(error);
                        }
                    },
                });
            } catch (error) {
                console.error(error);
            }
        };
        connectPusher();
    }, []);

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View className="px-2 my-3">
                    {isLoading ? (
                        <Text>Loading...</Text>
                    ) : (
                        tasksData.map((task) => <TaskItem key={task.id} {...task} />)
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Main;
