import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

console.log('[Server] Starting server...');
console.log(`[Server] Environment: ${process.env.NODE_ENV}`);
console.log(`[Server] Port: ${port}`);

// Global error handlers
process.on('uncaughtException', (error: Error) => {
  console.error('[Server] Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

app.listen(port, () => {
  console.log(`[Server] Server is running on port ${port}`);
  console.log('[Server] Available routes:');
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      console.log(`[Server] Direct route: ${middleware.route.path}`);
      console.log(`[Server] Methods:`, middleware.route.methods);
    } else if (middleware.name === 'router') {
      console.log(`[Server] Router middleware at: ${middleware.regexp}`);
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          console.log(`[Server] Route: ${handler.route.path}`);
          console.log(`[Server] Method: ${handler.route.stack[0].method.toUpperCase()}`);
          console.log(`[Server] Full path: ${middleware.regexp}${handler.route.path}`);
        }
      });
    } else {
      console.log(`[Server] Other middleware: ${middleware.name}`);
    }
  });
}); 