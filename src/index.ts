import * as fs from "fs";
import inquirer from "inquirer";

interface Task{
    id: number
    description: string;
    completed: boolean;
}

const tasks: Task[] = [];

function addTask(description: string): void {
    const newTask: Task = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        description,
        completed: false,
    };

    tasks.push(newTask);
    console.log(`Task added: ${description}`);
    saveTasksToFile();
}

function removeTask(id: number): void{ 
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex!==-1){
        const removedTask = tasks.splice(taskIndex, 1);
        console.log(`Task removed: "${removedTask[0].description}"`);
    }
    else{
        console.log(`Task with ID ${id} not found.`);
    }
    saveTasksToFile();
}

function listTasks(): void {
    if (tasks.length === 0) {
        console.log("No tasks found.");
        return;
    }

    console.log("\nYour Tasks:");
    tasks.forEach(task => {
        console.log(
            `ID: ${task.id}, Description: ${task.description}, Completed: ${task.completed ? "Yes":"No"}`
        );
    });
    console.log("");
}

function saveTasksToFile(): void {
    const jsonData = JSON.stringify(tasks, null, 2);
    fs.writeFileSync("tasks.json", jsonData, "utf-8");
    console.log("Tasks saved to file.");
}

function loadTasksFromFile(): void {
    try {
        const data = fs.readFileSync("tasks.json","utf-8");
        tasks.push(...JSON.parse(data));
        console.log("Tasks loaded from file.");
    }
    catch (error) {
        if(error instanceof Error && (error as NodeJS.ErrnoException).code === "ENOENT"){
            console.log("No tasks file found. Starting fresh.");
        }
        else {
            console.error("Error reading tasks file:", error);
        }
    }
}

function markTaskAsCompleted(id: number): void {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = true;
        console.log(`Task with ID ${id} marked as completed.`);
        saveTasksToFile();
    }
    else{
        console.log(`Task with ID ${id} not found.`);
    }
}

async function mainMenu(): Promise<void> {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "Add a task",
                "Remove a task",
                "List all tasks",
                "List completed tasks",
                "List pending tasks",
                "Mark a task as completed",
                "Exit"
            ]
        }
    ]);

    switch (action) {
        case "Add a task":
            await handleAddTask();
            break;
        case "Remove a task":
            await handleRemoveTask();
            break;
        case "List all tasks":
            await listTasks();
            break;
        case "List completed tasks":
            listCompletedTasks();
            break;
        case "List pending tasks":
            listPendingTasks();
            break;
        case "Mark a task as completed":
            await handleMarkTaskAsCompleted();
            break;
        case "Exit":
            console.log("Goodbye!");
            return;
    }

    await mainMenu();
}

async function handleAddTask(): Promise<void> {
    const { description } = await inquirer.prompt([
        {
            type: "input",
            name: "description",
            message: "Enter the task description:",
        }
    ]);

    if(description.trim()) {
        addTask(description);
    } else {
        console.log("Task description cannot be empty.");
    }
}

async function handleRemoveTask(): Promise<void> {
    const { id } = await inquirer.prompt([
        {
            type: "number",
            name: "id",
            message: "Enter the task ID to remove:",
        }
    ]);

    removeTask(id);
}

async function handleMarkTaskAsCompleted(): Promise<void> {
    const { id } = await inquirer.prompt([
        {
            type: "number",
            name: "id",
            message: "Enter the task ID to mark as completed:",
        }
    ]);

    markTaskAsCompleted(id);
}

function listCompletedTasks(): void {
    const completedTasks = tasks.filter(task => task.completed);

    if (completedTasks.length===0) {
        console.log("No completed tasks found.");
        return;
    }

    console.log("\nCompleted Tasks:");
    completedTasks.forEach(task => console.log(`ID: ${task.id}, Description: "${task.description}"`));
    console.log("");
}

function listPendingTasks(): void {
    const pendingTasks = tasks.filter(task => !task.completed);

    if(pendingTasks.length === 0) {
        console.log("No pending tasks found.");
        return;
    }

    console.log("\nPending Tasks:");
    pendingTasks.forEach(task => console.log(`ID: ${task.id}, Description: "${task.description}"`));
    console.log("");
}

loadTasksFromFile();
mainMenu();
/*listTasks();
addTask("Learn TypeScript");
addTask("Build a To-Do App");


console.log("\nAfter adding a task:");

listTasks();

removeTask(1);

console.log("After removing a task:");

listTasks();

markTaskAsCompleted(2);

listTasks();*/