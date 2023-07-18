const authService = require('../services/authService');

const authController = {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { token } = await authService.login(req.body);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  },

  async approveLoginRequest(req, res, next) {
    try {
      const user = await authService.approveLoginRequest(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async getUsersByRole(req, res, next) {
    try {
      const users = await authService.getUsersByRole(req.params.role);
      res.json(users);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;