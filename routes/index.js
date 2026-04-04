const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');

// Setup all routes
const setupRoutes = (app) => {
  app.use(
    '/api/auth',
    authRoutes
  );

  app.use(
    '/api/users',
    userRoutes
  );

  app.use(
    '/api/categories',
    categoryRoutes
  );

  // Health check
  app.get(
    '/health',
    (req, res) => {
      res.json({ status: 'OK', message: 'Server is running' });
    }
  );

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
};

module.exports = setupRoutes;
