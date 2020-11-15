const Employee = require("../lib/Employee");

// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.
class Manager extends Employee {
    constructor(name, id, email, officeNumber) {
        super(name, id, email);
        this.officeNumber = officeNumber;
        this.role = "Manager"
    }

    getOfficeNumber() {
        let o = this.officeNumber
        return o
    }
}

    module.exports = Manager