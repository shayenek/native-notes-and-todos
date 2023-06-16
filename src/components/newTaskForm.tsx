import React, { useContext } from 'react';
import { Formik } from 'formik';
import { View, Text, TextInput, Button, useColorScheme } from 'react-native';
import { AppContext } from '../providers/AppContext';
import { createTask } from '../api/tasks';

export const NewTaskForm = ({ theme }: { theme: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const { closeModal } = useContext(AppContext);

    const textInputStyle = {
        color: isDarkMode ? 'white' : 'black',
        backgroundColor: isDarkMode ? theme.colors.navItemDarkBg : theme.colors.navItemLightBg,
        borderColor: isDarkMode ? theme.colors.darkBorderColor : theme.colors.lightBorderColor,
    } as const;

    const textStyle = {
        color: isDarkMode ? 'white' : 'black',
    };

    const handleFormSubmit = async (values: any) => {
        try {
            await createTask(values);
            closeModal();
            console.log('task created');
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Formik
            initialValues={{ title: '', description: '' }}
            onSubmit={(values) => handleFormSubmit(values)}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View>
                    <Text style={textStyle}>Title</Text>
                    <TextInput
                        onChangeText={handleChange('title')}
                        onBlur={handleBlur('title')}
                        value={values.title}
                        className="my-2 rounded-md py-2 px-4 border w-full"
                        style={textInputStyle}
                    />
                    <Text style={textStyle}>Description</Text>
                    <TextInput
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        value={values.description}
                        className="my-2 rounded-md py-4 px-4 border w-full"
                        style={{ ...textInputStyle, textAlignVertical: 'top' }}
                        multiline={true}
                        numberOfLines={8}
                    />
                    <Button onPress={handleSubmit} title="Add" />
                </View>
            )}
        </Formik>
    );
};
