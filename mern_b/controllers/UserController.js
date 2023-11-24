import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "./../models/User.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const userDoc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
    });

    const newUser = await userDoc.save();

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        _id: newUser._id,
      },
      process.env.JWT_SECRET
      // {
      //   expiresIn: "30d",
      // }
    );

    //Daca noi facem un console.log pentru newUser(care este obiect), vom gasi in el datele care au fost salvate
    //in baza de date plus inca citeva cimpuri suplimentare. Insa daca noi incercam sa copiem
    //acest obiect newUser prin operatorul spread(...) in alt obiect, vom observa ca de fapt
    //acest newUser contine mul mai multe cimpuri de serviciu, dar noua ne trebuie doar ceea ce
    //am salvat in baza de date. Din aceasta cauza vom lua newUser.__doc care va contine
    //informatia necesara noua si ii vom face spread(...).

    const { passwordHash, ...userData } = newUser._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Registration failed",
      err,
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Login or password is incorrect",
        err: "authLoginFailed",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(404).json({
        message: "Login or password is incorrect",
        err: "authLoginFailed",
      });
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        _id: user._id,
      },
      process.env.JWT_SECRET
      //{
      //expiresIn: "30d",
      //expiresIn: 60,
      //}
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Authorisation failed",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not find",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Access denied",
    });
  }
};
