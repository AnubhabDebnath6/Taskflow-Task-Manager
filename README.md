# TaskFlow – Task Management Web Application

TaskFlow is a responsive task management web app built with HTML5, CSS3 and vanilla JavaScript. Tasks are saved in the browser's Local Storage, so they stay after the page is refreshed.

**Live Demo:** https://anubhabdebnath6.github.io/Taskflow-Task-Manager
**GitHub Repository:** https://github.com/AnubhabDebnath6/Taskflow-Task-Manager

## Features

- Create, view, edit and delete tasks (with a confirmation before deleting)
- Each task stores: title, description, priority, creation date, due date, completion status
- Mark tasks as completed or pending
- Dashboard showing total, pending, completed and overdue tasks
- Search by title or description
- Filter by status (pending / completed / overdue) and by priority
- Sort by creation date, due date, priority or title
- Colour-coded priority borders and badges; overdue tasks highlighted in red
- Form validation with error messages and empty-state messages
- Responsive layout for desktop, tablet and mobile
- Data persists using Local Storage

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, media queries)
- JavaScript (ES6, DOM manipulation)
- Browser Local Storage
- Git and GitHub
- GitHub Pages (hosting)

## Project Structure

```
TaskFlow/
├── index.html
├── style.css
├── script.js
├── assets/
├── screenshots/
└── README.md
```

## How to Run Locally

1. Download or clone the repository:
   ```
   git clone (https://github.com/AnubhabDebnath6/Taskflow-Task-Manager)
   ```
2. Open the project folder.
3. Double-click `index.html` to open it in a browser (Chrome, Edge or Firefox).

No installation or build step is needed.

## How to Use

1. Fill in the **Add New Task** form (title, optional description, priority, due date) and click **Add Task**.
2. Tick the checkbox on a task to mark it completed (untick for pending).
3. Click **Edit** to change a task, or **Delete** to remove it (you will be asked to confirm).
4. Use the search box, filters and sort menu above the list to find tasks.
5. Refresh the page – your tasks are still there.

## Validation Rules

- Title is required and must be at least 3 characters.
- Due date is required.
- Due date cannot be in the past when adding a new task.

## Screenshots

See the `screenshots/` folder: dashboard, task form, task list and mobile view.

## Future Enhancements

- Categories / tags for tasks
- Dark mode
- Reminders and notifications
- React.js version
- User accounts with a backend database

## Author
Anubhab Debnath
