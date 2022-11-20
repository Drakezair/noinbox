#!/usr/bin/env node
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import figlet from "figlet";
import { execSync } from "child_process";

const boiler_plates = [
  {
    name: "ReactTs",
    value: "https://github.com/Drakezair/boilerplate-reactts.git",
  },
  {
    name: "NextTs",
    value: "https://github.com/Drakezair/nextts-boilerplate.git",
  },
];

const spinner = createSpinner("Getting and install boilerplate");

const runCommand = (command) => {
  execSync(`${command}`, { stdio: "inherit" });
};

const gitCommand = (repo, repoName) =>
  `git clone --depth 1 ${repo} ${repoName}`;
const deepInstall = (repoName) => `cd ${repoName} && yarn install`;
const rollBack = (repoName) => `rm -rf ${repoName}`;

inquirer
  .prompt([
    {
      type: "input",
      message: "name for your app",
      name: "repoName",
      default: "my-app",
    },
    {
      type: "list",
      name: "repo",
      message: "What type of project you want",
      choices: boiler_plates,
    },
  ])
  .then(({ repo, repoName }) => {
    try {
      spinner.start();
      runCommand(gitCommand(repo, repoName));
      runCommand(deepInstall(repoName));
      figlet(`${repoName} is created!`, function (err, data) {
        if (err) {
          console.log("Something went wrong...");
          console.dir(err);
          return;
        }
        spinner.success("DONE");
        console.log(data);
        console.log(chalk.green("Get started"));
        console.log(
          chalk.blue("Run ") + chalk.bgGray(`cd ${repoName} && yarn storybook`)
        );
        console.log(chalk.blue(`Go to `) + "http://localhost:6006");
      });
    } catch (e) {
      if (e.message.includes("cd")) {
        runCommand(rollBack(repoName));
      }
      spinner.error({ text: chalk.bgRed("Error:") + " " + e.message });
    }
  });
