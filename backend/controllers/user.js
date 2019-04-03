const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        return res.status(500).json({
          message: "User created!"
        });
      })
      .catch(err => {
        return res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "That email does not match a registered email."
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "That password does not match this email."
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
};

exports.getUser = (req, res, next) => {
  let fetchedUser;
  // chek auth req.userdata.userid
  //find user with that userid:
  User.findById(req.params.id)
    .then(user => { //then if that user exists, return that user data
      if(!user) {
        return res.status(401).json({
          message: "Invalid user for this account"
        });
      } else {
        fetchedUser = user;
        res.status(200).json(fetchedUser); //or return user?
      }
    })
    .catch(err => {//catch error return failure
      return res.status(500).json({
        message: "Something went wrong..."
      });
    });
};

exports.updateUser = (req, res, next) => {
  // check auth req.userdata.userid
  const user = new User({
    _id: req.userData.userId,
    email: req.body.email
  });
  User.updateOne( //find user to update
    { _id: req.userData.userId , email: req.userData.email},
    user
  )
    .then(result => { //then update user data
      if (result.n > 0) {  //then return user data        
        User.findOne({ email: req.body.email })
        .then(user => {
          if (!user) {
            return res.status(401).json({
              message: "Unable to update user."
            });
          }
          fetchedUser = user;
          const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
          });
        }).catch(err => {
          return res.status(401).json({
            message: "Invalid authentication credentials!"
          });
        });      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch(error => {//catch error return fail
      res.status(500).json({
        message: "Couldn't update user"
      });
    });
}
