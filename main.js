#! /usr/bin/env node

const args = process.argv.slice(2);
const [command, ...rest] = args;

const displayMenu = () => {
    console.log("task-cli list                  : List all tasks");
    console.log("task-cli add <task>            : Add a new task");
    console.log("task-cli update <id> <task>    : Update a task");
    console.log("task-cli delete <id>           : Delete a task");
}

const add = (description) => {
    console.log("adding", description);
};

const update = (id, description) => {
    console.log("updating task with id", id, description);
};

const remove = (id) => {
    console.log("delete task with id", id);
}


if (!command) {
    displayMenu();
    process.exit(1);
}

let description, id;
switch(command) {
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


