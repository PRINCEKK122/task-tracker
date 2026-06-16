#! /usr/bin/env node

import fs from "fs";

const args = process.argv.slice(2);
const [command, ...rest] = args;

if (!fs.existsSync("tasks.json")) {
  fs.writeFileSync("tasks.json", JSON.stringify({tasks: []}), "utf8");
}

const displayMenu = () => {
  console.log("task-cli list                  : List all tasks");
  console.log("task-cli add <task>            : Add a new task");
  console.log("task-cli update <id> <task>    : Update a task");
  console.log("task-cli delete <id>           : Delete a task");
};

const add = (description) => {
  try {
    if (!description) {
      throw new Error("Description is required.");
    }

    const newData = {
      description,
      status: "todo",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fileContent = fs.readFileSync("tasks.json", "utf8");

    let data;
    if (fileContent.length > 0) {
      data = JSON.parse(fileContent);
      data.tasks.push({ id: data.tasks.length + 1, ...newData });
    } else {
      data = {
        tasks: [{ id: 1, ...newData }],
      };
    }
    fs.writeFileSync("tasks.json", JSON.stringify(data), "utf8");
    // console.log(data.tasks);
  } catch (err) {
    console.log("error", err.message);
  }

};

const update = (id, description) => {
  console.log("updating task with id", id, description);
};

const remove = (id) => {
  console.log("delete task with id", id);
};

if (!command) {
  displayMenu();
  process.exit(1);
}

let description, id;
switch (command) {
  case "add":
    description = rest[0];
    add(description);
    break;
  case "update":
    id = rest[0];
    description = rest[1];
    update(id, description);
    break;
  case "delete":
    id = rest[0];
    remove(id);
    break;
  case "list":
    console.log("All tasks");
    break;
  default:
    console.log("invalid command!");
}
