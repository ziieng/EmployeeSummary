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
let lastId = 99

function makeId() {
    return parseInt(lastId) + 1
}

async function addEmployee() {
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
            default: makeId(),
            validate: (input) => (input == "") ? false : true
        },
        {
            type: "input",
            message: "What is this employee's email address?",
            name: "email",
            validate: function (email) {
                //test from https://gist.github.com/Amitabh-K/ae073eea3d5207efaddffde19b1618e8
                valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)

                if (valid) {
                    return true;
                } else {
                    console.log(".  Please enter a valid email address")
                    return false;
                }
            }
        }
    ]
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
    let ans = ""
    switch (type.type) {
        case "Engineer":
            //engineer adds: github username
            ans = await inquirer.prompt([...empQs,
                {
                    type: "input",
                    message: "What is this employee's GitHub username?",
                    name: "github",
                    validate: (input) => (input == "") ? false : true
                }
            ])
            //Create object with given values
            emp = new Engineer(ans.name, ans.id, ans.email, ans.github)
            break;
        case "Intern":
            //intern adds: school
            ans = await inquirer.prompt([...empQs,
                {
                    type: "input",
                    message: "What school is this employee attending?",
                    name: "school",
                    validate: (input) => (input == "") ? false : true
                }
            ])
            //Create object with given values
            emp = new Intern(ans.name, ans.id, ans.email, ans.school)
            break;
        case "Manager":
            //manager adds: office number
            ans = await inquirer.prompt([...empQs,
                {
                    type: "input",
                    message: "What is this employee's office number?",
                    name: "officeNumber",
                    validate: (input) => (input == "") ? false : true
                }
            ])
            //Create object with given values
            emp = new Manager(ans.name, ans.id, ans.email, ans.officeNumber)
            break;
    }
    lastId = emp.id
    return emp
}

//ask if they're done, or if they want another employee
//offer to list employees so far?
//loop back to start

async function chooseRoute() {
    if (employees.length === 0) {
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

            case "Exit":
                let confirm = await inquirer.prompt([{
                    type: "list",
                    message: "Are you sure you want to exit without creating HTML file?",
                    name: "next",
                    choices: [
                        "No",
                        "Yes",
                    ]
                }])
                if (confirm.next == "No") {
                    next = ""
                }
                break;
        }
    }

}

function listEmployees() {
    console.log("\n\nEmployees entered so far:\n--------------")
    let engArr = employees.filter(employee => employee.getRole() === "Engineer")
    if (engArr.length > 0) {
        console.log("Engineers:\n")
        engArr.forEach(eng => {
            console.log(`--Name: ${eng.name} - ID ${eng.id}`)
        })
        console.log("\n--------------")
    }
    let intArr = employees.filter(employee => employee.getRole() === "Intern")
    if (intArr.length > 0) {
        console.log("Interns:\n")
        intArr.forEach(int => {
            console.log(`--Name: ${int.name} - ID ${int.id}`)
        })
        console.log("\n--------------")
    }
    let manArr = employees.filter(employee => employee.getRole() === "Manager")
    if (manArr.length > 0) {
        console.log("Managers:\n")
        manArr.forEach(man => {
            console.log(`--Name: ${man.name} - ID ${man.id}`)
        })
    }
    console.log("\n")

}

function makePage() {
    //create output folder if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    let pageMade = render(employees)
    fs.writeFile(outputPath, pageMade, (err) => console.log(err))
    let styles = fs.readFile(path.resolve(__dirname, "../templates/style.css"), (err) => console.log(err))
    fs.writeFile(path.join(OUTPUT_DIR, "style.css"), styles, (err) => console.log(err))
    console.log(`Page created!\nLocation: ${outputPath}`)
}

chooseRoute()