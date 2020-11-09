//START assignment-provided code
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const render = require("./lib/htmlRenderer");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
//END assignment-provided code

const employees = []

const empQs = [{
        type: "input",
        message: "What is this employee's name?",
        name: "name",
        validate: (input) => (input == "") ? false : true
    },
    {
        type: "input",
        message: "What is this employee's ID number?",
        name: "id",
        validate: (input) => (input == "") ? false : true
    },
    {
        type: "input",
        message: "What is this employee's email address?",
        name: "email",
        validate: (input) => (input == "") ? false : true
    }
]

//start: ask user what employee type to add

//all: name, id, email
async function addEmployee() {
    let emp = {}
    const type = await inquirer.prompt([{
        type: "list",
        message: "Which type of employee do you want to add?",
        name: "type",
        choices: [
            "Engineer",
            "Intern",
            "Manager",
            "(Cancel)"
        ]
    }])
    switch (type) {
        case "Engineer":
            //engineer adds: github username
            const ans = await inquirer.prompt([...empQs,
                {
                    type: "input",
                    message: "What is this employee's GitHub username?",
                    name: "github",
                    validate: (input) => (input == "") ? false : true
                }
            ])
            //Create object with given values
            emp = new Engineer(Object.values(ans))
            break;
        case "Intern":
            //intern adds: school
            const ans = await inquirer.prompt([...empQs,
                {
                    type: "input",
                    message: "What school is this employee attending?",
                    name: "school",
                    validate: (input) => (input == "") ? false : true
                }
            ])
            //Create object with given values
            emp = new Intern(Object.values(ans))
            break;
        case "Manager":
            //manager adds: office number
            const ans = await inquirer.prompt([...empQs,
                {
                    type: "input",
                    message: "What is this employee's office number?",
                    name: "officeNumber",
                    validate: (input) => (input == "") ? false : true
                }
            ])
            //Create object with given values
            emp = new Manager(Object.values(ans))
            break;
        default:
            break;
    }
    return emp
}

//ask if they're done, or if they want another employee
//offer to list employees so far?
//loop back to start

async function chooseRoute() {
    if (employees == "[]") {
        let newEmployee = await addEmployee()
        employees.push(newEmployee)
    }
    let next = ""
    let pick = {}

    while (next != "Exit") {
        pick = await inquirer.prompt([{
            type: "list",
            message: "What would you like to do?",
            name: "next",
            choices: [
                "Add new employee",
                "List employees entered so far",
                "Create website",
                "Exit without creating website"
            ]
        }])
        next = pick.next.split(" ")
        next = next[0]
        switch (next) {
            case "Add":
                newEmployee = await addEmployee()
                employees.push(newEmployee)
                break;

            case "List":
                listEmployees()
                break;

            case "Create":
                makePage()
                next = "Exit"
                break;

            default:
                break;
        }
    }

}


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

//create output folder if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.