#! /usr/bin/env node

import fs from "fs";

const args = process.argv.slice(2);
const [command, ...rest] = args;

const STATUSES = {
  todo: "todo",
  inProgress: "in-progress",
  done: "done",
};
const FILE = "tasks.json";

if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify({ tasks: [] }, null, 2), "utf8");
}

const displayMenu = () => {
  console.log("task-cli list                  : List all tasks");
  console.log("task-cli add <task>            : Add a new task");
  console.log("task-cli update <id> <task>    : Update a task");
  console.log("task-cli delete <id>           : Delete a task");
};

const add = (description) => {
  if (!description) {
    throw new Error("Description is required.");
  }

  const contents = fs.readFileSync(FILE, "utf8");
  const data = JSON.parse(contents);

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

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
  console.log(`Task added successfully (ID: ${newData.id})`);
};

const update = (id, description) => {
  console.log("updating task with id", id, description);
};

const remove = (id) => {
  const content = fs.readFileSync(FILE, "utf8");
  const data = JSON.parse(content);
  const taskIds = data.tasks.map((task) => task.id);

  if (!taskIds.includes(id)) {
    console.log(`Task with ID: ${id} does not exist!`);
    return;
  }

  data.tasks = data.tasks.filter((task) => task.id !== id);
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
  console.log(`Task removed successfully (ID: ${id})`);
};

if (!command) {
  displayMenu();
  process.exit(1);
}

try {
  switch (command) {
    case "add": {
      const description = rest[0];
      add(description);
      break;
    }
    case "update": {
      const id = rest[0];
      const description = rest[1];
      update(id, description);
      break;
    }
    case "delete": {
      const id = Number(rest[0]);
      remove(id);
      break;
    }
    case "list":
      console.log("All tasks");
      break;
    default:
      console.log("invalid command!");
  }
} catch (err) {
  if (err.code === "ENOENT") console.error("File missing", err.message);
  else console.error("error:", err.message);
}
