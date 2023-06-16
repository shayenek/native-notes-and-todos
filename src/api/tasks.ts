import Config from 'react-native-config';
import { Task } from '../utils/types';

export const getTasksData = async () => {
    try {
        const response = await fetch(`${Config.API_URL}/api/tasks/alltasks`, {
            headers: {
                Authorization: Config.API_SECRET!,
            },
        });
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
};

export const createTask = async (task: Task) => {
    try {
        const response = await fetch(`${Config.API_URL}/api/tasks/new`, {
            method: 'POST',
            headers: {
                Authorization: Config.API_SECRET!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
            }),
        });
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
};

export const deleteTaskById = async (id: string) => {
    try {
        const response = await fetch(`${Config.API_URL}/api/tasks/delete/${id}`, {
            headers: {
                Authorization: Config.API_SECRET!,
            },
        });
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
};
