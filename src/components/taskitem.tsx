import React, { ReactNode } from 'react';
import { Button, Card, Divider, Text } from 'react-native-paper';

import { Task } from '../../src/utils/types';
import { Image, Linking, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useAppTheme } from '../../App';
import { deleteTaskById } from '../api/tasks';

const IsDarkColor = (color: string) => {
    color = color.replace(/\s/g, '').toLowerCase();

    if (color.startsWith('rgb(') && color.endsWith(')')) {
        const rgbValues = color.substring(4, color.length - 1).split(',');

        let r,
            g,
            b = 0;

        if (typeof rgbValues[0] !== 'undefined') {
            r = parseInt(rgbValues[0], 10);
        }
        if (typeof rgbValues[1] !== 'undefined') {
            g = parseInt(rgbValues[1], 10);
        }
        if (typeof rgbValues[2] !== 'undefined') {
            b = parseInt(rgbValues[2], 10);
        }

        let luminance = 0;
        if (typeof r !== 'undefined' && typeof g !== 'undefined' && typeof b !== 'undefined') {
            luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        }

        if (luminance <= 0.5) {
            return true;
        } else {
            return false;
        }
    }

    return false;
};

const TaskHeader: (taskTitle: string) => ReactNode = (taskTitle) => {
    const theme = useAppTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        taskTitle: isDarkMode ? theme.colors.darkTaskTitle : theme.colors.lightTaskTitle,
    };

    if (taskTitle.includes('#')) {
        const taskTitleArray = taskTitle.split('#');
        const firstPart = taskTitleArray[0]?.trim();
        const hashtags = taskTitleArray.slice(1);

        return (
            <View className="flex flex-row items-center justify-between">
                <Text
                    className="text-md max-w-[65vw]"
                    style={{
                        color: backgroundStyle.taskTitle,
                    }}
                >
                    {firstPart}
                </Text>
                <View className="flex ml-4">
                    {hashtags.map((word) => {
                        const wordArray = word.split('-');
                        let cleanWord = '';
                        if (typeof wordArray[0] !== 'undefined') {
                            cleanWord = wordArray[0];
                        }
                        let wordBgColor = 'transparent';
                        if (typeof wordArray[1] !== 'undefined') {
                            wordBgColor = wordArray[1];
                            wordBgColor = wordBgColor.replace('[', '').replace(']', '');
                        }

                        return (
                            <Text
                                className={`rounded-full px-2.5 py-1.5 text-xs font-bold${
                                    IsDarkColor(wordBgColor) ? ' text-white' : ' text-black'
                                }`}
                                style={{
                                    backgroundColor: wordBgColor,
                                }}
                                key={cleanWord}
                            >
                                #{cleanWord}
                            </Text>
                        );
                    })}
                </View>
            </View>
        );
    } else {
        return <Text>{taskTitle}</Text>;
    }
};

const TaskDescription: (taskDescription: string) => ReactNode = (taskDescription) => {
    const theme = useAppTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        taskDesc: isDarkMode ? theme.colors.darkTaskDesc : theme.colors.lightTaskDesc,
    };
    if (taskDescription.includes('https://') || taskDescription.includes('http://')) {
        let descriptionArray = taskDescription.split(/(https?:\/\/\S+)/gi);
        descriptionArray = descriptionArray.filter(
            (word) => word !== '' && word !== ' ' && word !== '\n' && word !== '\n\n'
        );
        const newDescription = descriptionArray.map((word, index) => {
            word = word.replace('\n\n', '').replace('\n', '');
            if (word.includes('https://') || word.includes('http://')) {
                const faviconUrl = `https://s2.googleusercontent.com/s2/favicons?domain=${word}`;
                const handlePress = () => {
                    Linking.openURL(word);
                };
                return (
                    <TouchableOpacity onPress={handlePress} key={index}>
                        <Image
                            source={{ uri: faviconUrl }}
                            alt={word}
                            style={styles.touchableOpacity.image}
                        />
                        <Text className="text-blue-500">
                            {word
                                .replace('https://', '')
                                .replace('http://', '')
                                .replace('www.', '')}
                        </Text>
                    </TouchableOpacity>
                );
            } else {
                return (
                    <Text
                        key={index}
                        style={{
                            color: backgroundStyle.taskDesc,
                        }}
                    >
                        {word}
                    </Text>
                );
            }
        });
        return <View>{newDescription}</View>;
    } else {
        return (
            <Text
                style={{
                    color: backgroundStyle.taskDesc,
                }}
            >
                {taskDescription}
            </Text>
        );
    }
};

const TaskItem = (task: Task) => {
    const theme = useAppTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        taskBg: isDarkMode ? theme.colors.darkTaskBg : theme.colors.lightTaskBg,
        taskDesc: isDarkMode ? theme.colors.darkTaskDesc : theme.colors.lightTaskDesc,
    };

    const handleTaskDelete = () => {
        try {
            deleteTaskById(task.id).then(() => {
                console.log('Task deleted successfully!');
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Card
            key={task.id}
            className="mb-2"
            style={{
                backgroundColor: backgroundStyle.taskBg,
            }}
        >
            <Card.Content>
                {TaskHeader(task.title)}
                <Divider bold className="my-2" />
                {TaskDescription(task.description)}
                <Divider bold className="mt-2" />
            </Card.Content>
            <Card.Actions>
                <Button mode="contained" buttonColor="red" onPress={handleTaskDelete}>
                    Delete
                </Button>
            </Card.Actions>
        </Card>
    );
};

const styles = {
    touchableOpacity: {
        image: {
            marginRight: 1,
            borderRadius: 5,
        },
    },
};

export default TaskItem;
