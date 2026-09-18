const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  createUser,
  findUserByEmail,
} = require("../models/userModel");

// =====================================
// Register User
// =====================================

const register = (req, res) => {
  const { name, email, password, role } = req.body;

  // Check required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  // Default role is patient
  const userRole = role || "patient";

  // Check if email already exists
  findUserByEmail(email, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    bcrypt.hash(password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        console.error(hashError);

        return res.status(500).json({
          success: false,
          message: "Password encryption failed",
        });
      }

      // Save user in MySQL
      createUser(
        name,
        email,
        hashedPassword,
        userRole,
        (createError, result) => {
          if (createError) {
            console.error(createError);

            return res.status(500).json({
              success: false,
              message: "User registration failed",
            });
          }

          return res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: result.insertId,
          });
        }
      );
    });
  });
};

// =====================================
// Login User
// =====================================

const login = (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Find user by email
  findUserByEmail(email, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    // User not found
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = results[0];

    // Compare entered password with hashed password
    bcrypt.compare(password, user.password, (compareError, isMatch) => {
      if (compareError) {
        console.error(compareError);

        return res.status(500).json({
          success: false,
          message: "Password verification failed",
        });
      }

      // Wrong password
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Create JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // Send successful login response
      return res.json({
        success: true,
        message: "Login successful",
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  });
};

// =====================================
// Export Functions
// =====================================

module.exports = {
  register,
  login,
};