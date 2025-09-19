export default class User {
    constructor(id, name, email, password, profilePicture, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password; // hashed in real use
        this.profilePicture = profilePicture;
        this.role = role;
    }

    login() {
        console.log(`${this.name} logged in.`);
    }

    logout() {
        console.log(`${this.name} logged out.`);
    }

    editProfile(newName, newEmail) {
        this.name = newName;
        this.email = newEmail;
    }

    changePassword(newPassword) {
        this.password = newPassword;
    }

    verifyPassword(inputPassword) {
        return this.password === inputPassword;
    }
}
