import React, { useContext, useEffect, useState } from 'react';
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
import { AppContext } from '../providers/AppContext';
const Main = () => {
    const theme = useAppTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? theme.colors.darkBg : theme.colors.lightBg,
    };

    const [isLoading, setLoading] = useState(true);
    const [tasksData, setTasksData] = useState<Task[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const { filteredByHash } = useContext(AppContext);

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

    const sortByHash = (data: Task[], hash: string) => {
        const newData = data?.filter((task) => {
            const words = task.title.split(' ');
            const filteredWords = words.filter((word) => {
                if (word.includes('#')) {
                    const cleanedWord = word.replace('#', '').replace(' ', '').split('-')[0];
                    const cleanedHash = hash.replace(' ', '').replace('#', '');
                    if (cleanedWord === cleanedHash) {
                        return true;
                    }
                }
                return false;
            });
            return filteredWords.length > 0;
        });

        return newData;
    };

    useEffect(() => {
        if (filteredByHash) {
            const filteredHashWithSymbol = `#${filteredByHash}`;
            const filteredData = sortByHash(tasksData, filteredHashWithSymbol);
            setTasksData(filteredData);
        } else {
            handleGetTaskData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredByHash]);

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
                <View className="px-2 my-3 min-h-screen" style={backgroundStyle}>
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
