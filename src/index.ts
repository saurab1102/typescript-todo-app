import * as fs from "fs";
import inquirer from "inquirer";

interface Task{
    id: number
    description: string;
    completed: boolean;
}

const tasks: Task[] = [];

function addTask(description: string): void {
    if (!description.trim()) {
        console.log("Error: Task description cannot be empty.");
        return;
    }

    if (tasks.some(task => task.description === description.trim())){
        console.log("Error: A task with this description already exists.");
        return;
    }

    const newTask: Task = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        description: description.trim(),
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

/*function listTasks(): void {
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
}*/

async function listTasksPaginated(): Promise<void> {
    if (tasks.length === 0) {
        console.log("Not tasks to display.");
        return;
    }

    let currentPage = 0;
    const pageSize = 5;

    while (true){
        console.log(`\nTasks (Page ${currentPage + 1}/${Math.ceil(tasks.length/pageSize)}):`);
        const page = tasks.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
        page.forEach(task => 
            console.log(`ID: ${task.id}, Description: "${task.description}", Completed: ${task.completed}`)
        );

        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "Navigate tasks:",
                choices: [
                    currentPage > 0 ? "Previous Page" : undefined,
                    (currentPage+1) * pageSize < tasks.length ? "Next Page" : undefined,
                    "Exit Pagination"
                ].filter(Boolean) as string[]
            }
        ]);

        if(action === "Previous Page") currentPage--;
        else if(action === "Next Page") currentPage++;
        else break;
    }
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
        if(task.completed) {
            console.log(`Task with ID ${id} is already completed.`);
            return;
        }
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
                "Sort tasks",
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
            await listTasksPaginated();
            break;
        case "List completed tasks":
            await listCompletedTasksPaginated();
            break;
        case "List pending tasks":
            await listPendingTasksPaginated();
            break;
        case "Mark a task as completed":
            await handleMarkTaskAsCompleted();
            break;
        case "Sort tasks":
            await handleSortTasks();
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
    if(tasks.length === 0) {
        console.log("No tasks to remove.");
        return;
    }

    const { id } = await inquirer.prompt([
        {
            type: "number",
            name: "id",
            message: "Enter the task ID to remove:",
            validate: input => tasks.some(task => task.id === input) || "Invalid task ID."
        }
    ]);

    removeTask(id);
}

async function handleMarkTaskAsCompleted(): Promise<void> {
    if (tasks.length === 0) {
        console.log("No tasks to mark as completed.");
        return;
    }

    const { id } = await inquirer.prompt([
        {
            type: "number",
            name: "id",
            message: "Enter the task ID to mark as completed:",
            validate: input => tasks.some(task => task.id ===input) || "Invalid ID"
        }
    ]);

    markTaskAsCompleted(id);
}

/*function listCompletedTasks(): void {
    const completedTasks = tasks.filter(task => task.completed);

    if (completedTasks.length===0) {
        console.log("No completed tasks found.");
        return;
    }

    console.log("\nCompleted Tasks:");
    completedTasks.forEach(task => console.log(`ID: ${task.id}, Description: "${task.description}"`));
    console.log("");
}*/

async function listCompletedTasksPaginated(): Promise<void> {
    const completedTasks = tasks.filter(task => task.completed);

    if(completedTasks.length===0) {
        console.log("No completed tasks found.");
        return;
    }

    let currentPage = 0;
    const pageSize = 5;

    while(true) {
        console.log(`\nCompleted Tasks (Page ${currentPage+1}/${Math.ceil(completedTasks.length/pageSize)}):`);
        const page = completedTasks.slice(currentPage * pageSize, (currentPage+1)*pageSize);
        page.forEach(completedTasks => 
            console.log(`ID: ${completedTasks.id}, Description: "${completedTasks.description}"`)
        );

        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "Navigate tasks:",
                choices: [
                    currentPage > 0 ? "Previous Page" : undefined,
                    (currentPage+1)*pageSize < completedTasks.length ? "Next Page" : undefined,
                    "Exit Pagination"
                ].filter(Boolean) as string[]
            }
        ]);

        if (action === "Previous Page") currentPage--;
        else if (action === "Next Page") currentPage++;
        else break;
    }
}

/*function listPendingTasks(): void {
    const pendingTasks = tasks.filter(task => !task.completed);

    if(pendingTasks.length === 0) {
        console.log("No pending tasks found.");
        return;
    }

    console.log("\nPending Tasks:");
    pendingTasks.forEach(task => console.log(`ID: ${task.id}, Description: "${task.description}"`));
    console.log("");
}*/

async function listPendingTasksPaginated(): Promise<void> {
    const pendingTasks = tasks.filter(task => !task.completed);

    if(pendingTasks.length===0) {
        console.log("No pending tasks found.");
        return;
    }

    let currentPage = 0;
    const pageSize = 5;

    while(true) {
        console.log(`\nCompleted Tasks (Page ${currentPage+1}/${Math.ceil(pendingTasks.length/pageSize)}):`);
        const page = pendingTasks.slice(currentPage * pageSize, (currentPage+1)*pageSize);
        page.forEach(pendingTasks => 
            console.log(`ID: ${pendingTasks.id}, Description: "${pendingTasks.description}"`)
        );

        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "Navigate tasks:",
                choices: [
                    currentPage > 0 ? "Previous Page" : undefined,
                    (currentPage+1)*pageSize < pendingTasks.length ? "Next Page" : undefined,
                    "Exit Pagination"
                ].filter(Boolean) as string[]
            }
        ]);

        if (action === "Previous Page") currentPage--;
        else if (action === "Next Page") currentPage++;
        else break;
    }
}

async function handleSortTasks(): Promise<void> {
    const { sortBy } = await inquirer.prompt([
        {
            type: "list",
            name: "sortBy",
            message: "Sort tasks by:",
            choices: ["ID", "Description", "Completed"]
        }
    ]);

    const sortKey = sortBy.toLowerCase() as "id" | "description" | "completed";
    sortTasks(sortKey);
    console.log(`Tasks sorted by ${sortBy.toLowerCase()}.`);
    await listTasksPaginated();
}

function sortTasks(by: "id"|"description"|"completed"): void {
    tasks.sort((a,b) => {
        if(by === "id") return a.id - b.id;
        if (by === "description") return a.description.localeCompare(b.description);
        if (by === "completed") return Number(a.completed) - Number(b.completed);
        return 0;
    });
    saveTasksToFile();
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