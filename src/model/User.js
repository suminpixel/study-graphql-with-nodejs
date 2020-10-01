const ObjectID = require('bson-objectid');
const _ = require('lodash');

const users = [
  {
    id: ObjectID('5f4b3594e4ec9764e80ea8c7').toHexString(),
    name: 'harry',
    email: 'harry@gmail.com',
    loginCount: 3,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    profileImageUrl: 'http://localhost:9000/uploads/harry.png',
  },
  {
    id: ObjectID('5f4b3594e4ec9764e80ea8c8').toHexString(),
    name: 'jeffrey',
    email: 'jeffrey@gmail.com',
    loginCount: 1,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    profileImageUrl: 'http://localhost:9000/uploads/jeffrey.png',
  },
  {
    id: ObjectID('5f4b3594e4ec9764e80ea8c9').toHexString(),
    name: 'jin',
    email: 'jin@gmail.com',
    loginCount: 1,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    profileImageUrl: 'http://localhost:9000/uploads/jin.png',
  },
];

const findUserBy = (id) => (u) => u.id === id;

module.exports = class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.loginCount = user.loginCount;
    this.lastLoginAt = user.lastLoginAt;
    this.profileImageUrl = user.profileImageUrl;
  }

  static find(query) {
    return {
      exec(fun) {
        if (query) {
          fun(
            null,
            users.filter((v) => v.email == query.email && v.name == query.name),
          );
        } else {
          fun(null, users);
        }
      },
    };
  }

  static findOne(query) {
    return {
      exec(fun) {
        if (query) {
          const found = users.find((v) => v.email == query.email);
          if (found) fun(null, found);
          else fun(null, null);
        } else {
          fun(null, null);
        }
      },
    };
  }

  static findById(id) {
    return {
      exec(func) {
        const user = users.find(findUserBy(id));
        if (!user) {
          func(new Error(`Can not find User by given id (${id})`));
        } else {
          func(null, user);
        }
      },
    };
  }

  static deleteOne({ id }, func) {
    const userIdx = users.findIndex(findUserBy(id));
    if (userIdx < 0) {
      func(new Error(`Can not find User by given id (${id})`));
      return;
    }
    if (!user) {
      func(new Error(`Can not find User by given id (${this.id})`));
    } else {
      users.splice(userIdx, 1);
      func();
    }
  }

  static create(user) {
    users.push({
      ...user,
      id: ObjectID().toHexString(),
      createAt: new Date(),
      loginCount: 0,
      lastLoginAt: null,
    });
  }

  save(func) {
    const user = users.find(findUserBy(this.id));

    if (!user) {
      func(new Error(`Can not find User by given id (${this.id})`));
      return;
    }

    const toUpdate = _.pickBy(this, _.identity); // remove undefined filed

    Object.assign(user, toUpdate);
    func();
  }
};
