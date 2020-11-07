// TODO: Write code to define and export the Employee class
class Employee {
    constructor(name, id, email) {
        this.name = name
        this.id = id
        this.email = email
        this.role = "Employee"
    }

    getName() {
        let n = this.name
        return n
    }

    getId() {
        let i = this.id
        return i
    }

    getEmail() {
        let e = this.email
        return e
    }

    getRole() {
        let r = this.role
        return r
    }
    }

    module.exports = Employee