# Command-Line To-Do List App

A simple and interactive command-line To-Do list application built with **Node.js** and **TypeScript**. The app allows you to add, remove, list, and mark tasks as completed. Tasks are stored in a JSON file, making it persistent across sessions.

---

### Features

- **Add tasks**: Create new tasks with descriptions.
- **Remove tasks**: Delete tasks by ID.
- **View tasks**:
  - List all tasks (with pagination).
  - List completed tasks (with pagination).
  - List pending tasks (with pagination).
- **Mark tasks as completed**: Change the status of a task.
- **Sort tasks**: Sort tasks by ID, description, or completion status.
- **Persistent storage**: Tasks are saved to a JSON file (`tasks.json`), which is loaded at the start of the app.

---

### Installation

#### Requirements:
- **Node.js** (v18 or above)
- **npm** (Node Package Manager)

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/todo-cli-app.git
   cd todo-cli-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. To run the app locally:

   ```bash
   npm start
   ```

4. To build a standalone binary (optional):

   ```bash
   npm run build
   ```

   This will generate an executable file that you can run directly without needing Node.js installed.

---

### Usage

Once the app is running, you'll be presented with a menu to choose actions. The options include:

- **Add a task**: Adds a new task by entering a description.
- **Remove a task**: Remove a task by entering its ID.
- **List all tasks**: View all tasks with pagination.
- **List completed tasks**: View tasks that are marked as completed.
- **List pending tasks**: View tasks that are not completed.
- **Mark a task as completed**: Mark a task as completed by entering its ID.
- **Sort tasks**: Sort tasks by ID, description, or completion status.

---

### Contributing

Feel free to fork this project, open issues, and submit pull requests. Contributions are welcome!

---

### License

This project is open source and available under the [MIT License](LICENSE).