const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { db, jwt: jwtConfig } = require('../config/config');
const User = require('../models/user');
const { registerSchema, loginSchema } = require('../schemas/authSchemas');

const authService = {
  async register(data) {
    const { error } = registerSchema.validate(data);

    if (error) {
      throw new Error(error.message);
    }

    const { name, email, password, role } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  },

  async login(data) {
    const { error } = loginSchema.validate(data);

    if (error) {
      throw new Error(error.message);
    }

    const { email, password } = data;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return { token };
  },

  async approveLoginRequest(id) {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'gatekeeper') {
      throw new Error('Only gatekeepers can approve login requests');
    }

    user.approved = true;
    await user.save();

    return user;
  },

  async getUsersByRole(role) {
    const users = await User.findAll({ where: { role, approved: true } });
    return users;
  },
};

module.exports = authService;