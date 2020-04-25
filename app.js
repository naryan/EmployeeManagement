const fs = require("fs");
const inquirer = require("inquirer");
const Employee = require("./lib/Employee");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

let html = "";

//General Question for the employee
const employee = [
  {
    name:"name",
    type:"input",
    message: "Enter employee's name?"
  },
  {
    name:"id",
    type:"input",
    message: "Enter employee's ID?"
  },
  {
    name:"email",
    type:"input",
    message:"Enter employee's email?"
  },
  {
    name:"role",
    type:"list",
    choices:["MANAGER", "ENGINEER", "INTERN"]
  }
];

// Question for manager
const managerQuestion = [
  {
    name:"officeNum",
    type:"input",
    message:"Enter MANAGER'S office number?"
  }
];

// Question for engineer
const engineerQuestion = [
  {
    name:"gitHub",
    type:"input",
    message:"Enter ENGINEER'S GitHub username"
  }
];

// Question for intern
const internQuestion = [
  {
    name:"school",
    type:"input",
    message:"Enter INTERN'S school name"
  }
];

// Function to create team members
function team(){
  //ask general employee question
  inquirer.prompt(employee)
  .then(answers => {
    switch(answers.role){
      //if role is mamager then ask one more question
      case "MANAGER":
        inquirer.prompt(managerQuestion).then(async managerAnswers => {
          const managerData = await new Manager(
            answers.name,
            answers.id,
            answers.email,
            managerAnswers.officeNum
          );
          readManager(managerData);
          //this function gives user to enter again or quit
          restart();
        });
        break;
      case "ENGINEER":
        inquirer.prompt(engineerQuestion).then(async engineerAnswer => {
          const engineerData = await new Engineer(
            answers.name,
            answers.id,
            answers.email,
            engineerAnswer.gitHub
          );
          readEngineer(engineerData);
          restart();
        })
        break;
      case "INTERN":
        inquirer.prompt(internQuestion).then(async internAnswer => {
          const internData = await new Intern(
            answers.name,
            answers.id,

            answers.email,
            internAnswer.school
          );
          readIntern(internData);
          restart();
        })
        break;
      default:
        break;df
    }
  });
};

// function to reenter the record or exit the application
const restart = () =>{
	inquirer.prompt({
    type:"list",
    name:"record",
    message: "Record another Employee??",
    choices: ["YES!!!", "NOPE, THATS EVERYONE!"]
  }).then(answer => {
		switch (answer.record) {
			case "YES!!!":
				team();
				break;

			case "NOPE, THATS EVERYONE!":
        // create html fdjfdbj
				createHTML();
				break;
		}
	});
}

function readManager(managerData){
  fs.readFile("./templates/manager.html", "utf8", function(error, data) {

    if(error) throw error;
    const icon = `<i class="far fa-chart-bar fa-2x"></i>`;
		// console.log(engineerData.name);
		const newData = data
      .replace("name", managerData.name)
      .replace("role", managerData.role)
			.replace("icon:", icon)
			.replace("Id", managerData.id)
			.replace("email",  managerData.email)
			.replace("officeNumber", managerData.officeNum);

		// read .html for all class values and the combine them before writing the file.
		html += newData;
	});

};

function readEngineer(engineerData){
  // console.log("this is printed", engineerData);
  fs.readFile("./templates/engineer.html", "utf8", function(error, data) {

    if(error) throw error;
    const icon = `<i class="far fa-chart-bar fa-2x"></i>`;
		const newData = data
      .replace("name", engineerData.name)
      .replace("role", engineerData.role)
			.replace("icon", icon)
			.replace("Id", engineerData.id)
			.replace("email",engineerData.email)
      .replace("Github", engineerData.gitHub);

      html += newData;
    });
};

function readIntern(internData){

  fs.readFile("./templates/intern.html", "utf8", function(error, data) {

    if(error) throw error;
    const icon = `<i class="far fa-chart-bar fa-2x"></i>`;
		const newData = data
      .replace("name", internData.name)
      .replace("role", internData.role)
			.replace("icon:", icon)
			.replace("Id", internData.id)
			.replace("email", internData.email)
      .replace("school", internData.school);

      html += newData;
    });
};


function createHTML() {
	fs.readFile("./templates/main.html", "utf8", (err, data) => {
    if(err) throw err;
		const newData = data.replace("{{ team }}", html);

		fs.writeFile("output/index.html", newData, "utf8", err => {
			if (err) throw err;
		});
		console.log(".html created");
	});
}

module.exports = {};


team();

