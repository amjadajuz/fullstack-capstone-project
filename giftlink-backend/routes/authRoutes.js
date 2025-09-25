//Step 1 - Task 2: Import necessary packages
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Gift = require("../models/Gift");
const Order = require("../models/Order");
const connectToDatabase = require("../models/db");
//Step 1 - Task 3: Create a Pino logger instance
const pino = require("pino");
const logger = pino(); // Create a Pino logger instance

dotenv.config();

//Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

const { body, validationResult } = require("express-validator");

router.post("/register", async (req, res) => {
  try {
    // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
    const db = await connectToDatabase();

    // Task 2: Access MongoDB collection
    const collection = db.collection("users");

    //Task 3: Check for existing email
    const existingUser = collection.findOne({ email: req.body.email });

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const email = req.body.email;

    //Task 4: Save user details in database
    const newUser = await collection.insertOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });

    //Task 5: Create JWT authentication with user._id as payload
    const payload = {
      user: {
        id: newUser.insertedId,
      },
    };

    const authtoken = jwt.sign(payload, JWT_SECRET);

    logger.info("User registered successfully");
    res.json({ authtoken, email });
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const user = await collection.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send("Wrong password");
    }
    const payload = { user: { id: user._id } };
    const authtoken = jwt.sign(payload, JWT_SECRET);
    res.json({ authtoken, email: user.email, name: user.name });
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

router.put("/update", async (req, res) => {
  const errors = validationResult(req);
  // Task 3: Check if `email` is present in the header and throw an appropriate error message if not present.
  if (!errors.isEmpty()) {
    logger.error("Validation errors in update request", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, name } = req.body;
    if (!email) {
      logger.error("Email not found in the request headers");
      return res
        .status(400)
        .json({ error: "Email not found in the request headers" });
    }
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const user = await collection.findOne({ email: email });
    if (!user) {
      logger.error("User not found");
      return res.status(400).send("User not found");
    }
    const newDetails = {
      name: name,
      updatedAt: new Date(),
    };
    const updatedUser = await collection.updateOne(
      { email: req.body.email },
      {
        $set: req.body,
      },
      { returnDocument: "after" }
    );
    const authtoken = jwt.sign(payload, JWT_SECRET);
    logger.info("User updated successfully");
    res.json({ authtoken });
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
