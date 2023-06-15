import React, { ReactNode } from 'react';
import { Button, Card, Text } from 'react-native-paper';

import { Task } from '../../src/utils/types';
import { View } from 'react-native';

const IsDarkColor = (color: string) => {
    color = color.replace(/\s/g, '').toLowerCase();

    if (color.startsWith('rgb(') && color.endsWith(')')) {
        const rgbValues = color.substring(4, color.length - 1).split(',');

        let r,
            g,
            b = 0;

        if (typeof rgbValues[0] !== 'undefined') {
            r = parseInt(rgbValues[0]);
        }
        if (typeof rgbValues[1] !== 'undefined') {
            g = parseInt(rgbValues[1]);
        }
        if (typeof rgbValues[2] !== 'undefined') {
            b = parseInt(rgbValues[2]);
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

const TaskHeader: (
    taskTitle: string,
    handleClick: (buttonText: string) => void,
    activatedHashFilter: string
) => ReactNode = (taskTitle, handleClickWord, activatedHashFilter) => {
    const handleClickWrapper: (text: string) => void = (text) => {
        console.log(text, activatedHashFilter);
        handleClickWord(text);
    };

    if (taskTitle.includes('#')) {
        const taskTitleArray = taskTitle.split('#');
        const firstPart = taskTitleArray[0]?.trim();
        const hashtags = taskTitleArray.slice(1);

        return (
            <>
                <Text>{firstPart}</Text>
                <View className="flex gap-1">
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
                            <Button
                                onPress={() => handleClickWrapper(`#${cleanWord}`)}
                                className={`rounded-full px-2.5 py-1.5 text-xs font-bold${
                                    IsDarkColor(wordBgColor) ? ' text-white' : ' text-black'
                                }`}
                                style={{
                                    backgroundColor:
                                        activatedHashFilter !== cleanWord
                                            ? wordBgColor
                                                  .replace('rgb(', 'rgba(')
                                                  .replace(')', ', 0.5)')
                                            : wordBgColor,
                                }}
                                key={cleanWord}
                            >
                                #{cleanWord}
                            </Button>
                        );
                    })}
                </View>
            </>
        );
    } else {
        return <Text>{taskTitle}</Text>;
    }
};

const TaskItem = (task: Task) => {
    return (
        <Card key={task.id} className="mb-2">
            <Card.Content>
                <Text variant="titleLarge">{TaskHeader(task.title, () => {}, '')}</Text>
                <Text variant="bodyMedium">{task.description}</Text>
            </Card.Content>
            <Card.Actions>
                <Button mode="contained" buttonColor="red">
                    Delete
                </Button>
            </Card.Actions>
        </Card>
    );
};

export default TaskItem;
