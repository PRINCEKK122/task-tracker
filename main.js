#! /usr/bin/env node

import fs from "fs";

const args = process.argv.slice(2);
const [command, ...rest] = args;

const STATUSES = Object.freeze({
  todo: "todo",
  inProgress: "in-progress",
  done: "done",
});
const FILE = "tasks.json";

const getData = () => {
  const content = fs.readFileSync(FILE, "utf8");
  return JSON.parse(content);
};

const writeDataToFile = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
};

if (!fs.existsSync(FILE)) {
  writeDataToFile({ tasks: [] });
}

const displayMenu = () => {
  console.log("task-cli list                  : List all tasks");
  console.log("task-cli add <task>            : Add a new task");
  console.log("task-cli update <id> <task>    : Update a task");
  console.log("task-cli delete <id>           : Delete a task");
};

const handleErr = (err) => {
  if (err.code === "ENOENT") console.error("File missing", err.message);
  else console.error("error:", err.message);
};

// Commands
const add = (description) => {
  if (!description) {
    throw new Error("Description is required.");
  }

  const data = getData();

  let nextId;

  if (data.tasks.length > 0) {
    const taskIds = data.tasks.map(({ id }) => id);
    nextId = Math.max(...taskIds) + 1;
  } else {
    nextId = 1;
  }

  const now = new Date().toISOString();
  const newData = {
    id: nextId,
    description,
    status: STATUSES.todo,
    createdAt: now,
    updatedAt: now,
  };
  data.tasks.push(newData);

  writeDataToFile(data);
  console.log(`Task added successfully (ID: ${newData.id})`);
};

const update = (id, description) => {
  if (!description) {
    throw new Error("Description is required.");
  }

  const data = getData();
  const task = data.tasks.find((t) => t.id === id);
  if (!task) {
    console.log(`Task with ID: ${id} does not exist!`);
    return;
  }

  task.description = description;
  task.updatedAt = new Date().toISOString();
  writeDataToFile(data);

  console.log(`Task with ID: ${id} has been updated successfully!`);
};

const remove = (id) => {
  const data = getData();
  const task = data.tasks.find((t) => t.id === id);
  if (!task) {
    console.log(`Task with ID: ${id} does not exist!`);
    return;
  }

  data.tasks = data.tasks.filter((t) => t.id !== id);
  writeDataToFile(data);
  console.log(`Task removed successfully (ID: ${id})`);
};

const list = (status) => {
  const data = getData();

  if (
    status !== "" &&
    !Object.values(STATUSES).includes(status.toLowerCase())
  ) {
    throw new Error("Status should be either done, todo or in-progress");
  }

  const tasks =
    status === ""
      ? data.tasks
      : data.tasks.filter((t) => t.status === status.toLowerCase());
  tasks.forEach((t) => {
    console.log(
      `ID: ${t.id}; Description: ${t.description}; Status: ${t.status}`,
    );
  });
};

const changeTaskStatus = (id, newStatus) => {
  const data = getData();
  const task = data.tasks.find((t) => t.id === id);
  if (!task) {
    console.log(`Task with ID: ${id} does not exist!`);
    return;
  }

  const oldStatus = task.status;
  task.status = newStatus;
  task.updatedAt = new Date().toISOString();
  writeDataToFile(data);
  console.log(
    `Task with ID: ${id} changed from status ${oldStatus} to ${newStatus}.`,
  );
};

// Init
if (!command || command === "help") {
  displayMenu();
  process.exit(1);
}

try {
  switch (command.toLowerCase()) {
    case "add": {
      const description = rest[0];
      add(description);
      break;
    }
    case "update": {
      const id = Number(rest[0]);
      const description = rest[1];
      update(id, description);
      break;
    }
    case "delete": {
      const id = Number(rest[0]);
      remove(id);
      break;
    }
    case "list": {
      const status = typeof rest[0] === "string" ? rest[0] : "";
      list(status);
      break;
    }
    case "mark-in-progress":
    case "mark-todo":
    case "mark-done": {
      const taskId = rest[0];
      const index = command.indexOf("-");
      const newStatus = command.substring(index + 1);
      changeTaskStatus(Number(taskId), newStatus);
      break;
    }
    default: {
      console.log("invalid command!");
      displayMenu();
      break;
    }
  }
} catch (err) {
  handleErr(err);
}
