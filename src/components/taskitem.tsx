import React, { ReactNode, useContext, useState } from 'react';
import { ActivityIndicator, Card, Divider, Text } from 'react-native-paper';

import { Task } from '../../src/utils/types';
import { Image, Linking, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useAppTheme } from '../../App';
import { deleteTaskById } from '../api/tasks';
import { AppContext } from '../providers/AppContext';

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

    const { filteredByHash, setFilteredByHash } = useContext(AppContext);

    if (taskTitle.includes('#')) {
        const taskTitleArray = taskTitle.split('#');
        const firstPart = taskTitleArray[0]?.trim();
        const hashtags = taskTitleArray.slice(1);

        return (
            <View className="flex flex-row items-center justify-between">
                <Text
                    className="text-md max-w-[60vw]"
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
                            <TouchableOpacity
                                className={'rounded-full px-2.5 py-1.5'}
                                style={{
                                    backgroundColor:
                                        filteredByHash !== cleanWord
                                            ? wordBgColor
                                                  .replace('rgb(', 'rgba(')
                                                  .replace(')', ', 0.4)')
                                            : wordBgColor,
                                }}
                                key={cleanWord}
                                onPress={() => {
                                    setFilteredByHash(cleanWord);
                                }}
                            >
                                <Text
                                    className={`text-xs font-bold${
                                        IsDarkColor(wordBgColor) ? ' text-white' : ' text-black'
                                    }`}
                                >
                                    #{cleanWord}
                                </Text>
                            </TouchableOpacity>
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

const ConfirmDeletion = ({
    taskId,
    deletionInProgress,
}: {
    taskId: string;
    deletionInProgress: () => void;
}) => {
    const theme = useAppTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        taskBg: isDarkMode ? theme.colors.darkTaskBg : theme.colors.lightTaskBg,
        taskDesc: isDarkMode ? theme.colors.darkTaskDesc : theme.colors.lightTaskDesc,
    };

    const { closeModal } = useContext(AppContext);

    const handleTaskDelete = () => {
        try {
            deleteTaskById(taskId).then(() => {
                console.log('Task deleted successfully!');
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = () => {
        deletionInProgress();
        closeModal();
        handleTaskDelete();
    };

    return (
        <View className="flex flex-col items-center justify-center">
            <Text
                className="text-lg font-bold mb-4"
                style={{
                    color: backgroundStyle.taskDesc,
                }}
            >
                Are you sure you want to delete this item?
            </Text>
            <View className="flex flex-row items-center justify-center">
                <TouchableOpacity
                    className="bg-red-500 rounded-full px-4 py-2 mr-2 w-24"
                    onPress={handleDelete}
                >
                    <Text className="text-white font-bold text-center">Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="rounded-full px-4 py-2 w-24 border"
                    style={{
                        backgroundColor: isDarkMode
                            ? theme.colors.navItemDarkBg
                            : theme.colors.navItemLightBg,
                        borderColor: isDarkMode
                            ? theme.colors.darkBorderColor
                            : theme.colors.lightBorderColor,
                    }}
                    onPress={closeModal}
                >
                    <Text
                        className="font-bold text-center"
                        style={{
                            color: backgroundStyle.taskDesc,
                        }}
                    >
                        No
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const TaskItem = (task: Task) => {
    const theme = useAppTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        taskBg: isDarkMode ? theme.colors.darkTaskBg : theme.colors.lightTaskBg,
        taskDesc: isDarkMode ? theme.colors.darkTaskDesc : theme.colors.lightTaskDesc,
    };

    const { openModal } = useContext(AppContext);

    const openDeleteModal = () => {
        openModal(
            <ConfirmDeletion taskId={task.id} deletionInProgress={deletionInProgressHandler} />
        );
    };

    const [deletionInProgress, setDeletionInProgress] = useState(false);

    const deletionInProgressHandler = () => {
        setDeletionInProgress(!deletionInProgress);
    };

    return (
        <Card
            key={task.id}
            className="mb-2"
            style={{
                backgroundColor: backgroundStyle.taskBg,
            }}
        >
            {deletionInProgress && (
                <View className="absolute w-full h-full flex items-center justify-center bg-black z-10 opacity-50 top-0 rounded-xl">
                    <ActivityIndicator animating={true} color={'red'} size="large" />
                </View>
            )}
            <View className="py-3">
                <Card.Content>
                    {TaskHeader(task.title)}
                    <Divider bold className="my-2" />
                    {TaskDescription(task.description)}
                    <Divider bold className="mt-2" />
                </Card.Content>
                <Card.Actions className="mb-0 pb-0">
                    <TouchableOpacity
                        onPress={openDeleteModal}
                        className="w-20 rounded-lg bg-red-600 px-4 py-2 mr-2 mt-2"
                    >
                        <Text className="text-sm font-bold text-white text-center">Delete</Text>
                    </TouchableOpacity>
                </Card.Actions>
            </View>
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
