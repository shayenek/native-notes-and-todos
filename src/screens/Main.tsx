import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, useColorScheme, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import TaskItem from '../components/taskitem';

import { Task } from '../../src/utils/types';

const Main = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState<Task[]>([]);

    const getMovies = async () => {
        try {
            const response = await fetch('http://192.168.31.35:3000/api/tasks/alltasks');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMovies();
    }, []);

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
                <Card className="mb-2">
                    <Card.Content>
                        <Text variant="titleLarge">Card title</Text>
                        <Text variant="bodyMedium">Card content</Text>
                    </Card.Content>
                    <Card.Actions>
                        <Button mode="contained" buttonColor="red">
                            Delete
                        </Button>
                    </Card.Actions>
                </Card>
                <View>
                    {isLoading ? (
                        <Text>Loading...</Text>
                    ) : (
                        data.map((task) => <TaskItem key={task.id} {...task} />)
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Main;
