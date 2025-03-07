const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/pathUtil");

const userPath = path.join(rootDir, "data", "user.json");

module.exports = class User {
  constructor(name, email, password) {
    this.id = 0;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  save() {
    User.getAllUser((data) => {
      if (this.id > 0) {
        data = data.map((home) => {
          if (home.id === this.id) {
            return this;
          }

          return home;
        });
      } else {
        this.id = data.length + 1;
        data.push(this);
      }
      fs.writeFile(userPath, JSON.stringify(data), (err) => {
        console.log("file writing...", err);
      });
    });
  }

  static getAllUser(callback) {
    fs.readFile(userPath, (err, data) => {
      if (!err) {
        const parsedData = JSON.parse(data);
        callback(parsedData);
      } else callback([]);
    });
  }

  static getUserByEmail(email, callback) {
    User.getAllUser((user) => {
      const userFound = user.find((el) => el.email === email);
      callback({
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
      });
    });
  }

  static deleteUserById(id, callback) {
    User.getAllUser((user) => {
      user = user.filter((el) => el.id !== id);
      fs.writeFile(userPath, JSON.stringify(user), callback);
    });
  }
};
