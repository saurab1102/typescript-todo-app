import * as fs from "fs";

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

loadTasksFromFile();

console.log("Initial tasks:");
listTasks();
addTask("Learn TypeScript");
addTask("Build a To-Do App");
console.log("\nAfter adding a task:");
listTasks();

removeTask(1);
console.log("After removing a task:");
listTasks();

removeTask(3);