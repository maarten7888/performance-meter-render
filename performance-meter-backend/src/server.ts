import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

console.log('==========================================');
console.log('[Server] Starting server...');
console.log('==========================================');
console.log(`[Server] Environment: ${process.env.NODE_ENV}`);
console.log(`[Server] Port: ${port}`);
console.log(`[Server] Current directory: ${process.cwd()}`);
console.log(`[Server] Node version: ${process.version}`);
console.log(`[Server] Platform: ${process.platform}`);

// Log all express route middleware
console.log('\n[Server] Express app middleware:');
app._router.stack.forEach((middleware: any, i: number) => {
  console.log(`\n[Server] Middleware ${i}: ${middleware.name}`);
  if (middleware.route) {
    console.log(`[Server] Route: ${middleware.route.path}`);
    console.log(`[Server] Methods: ${Object.keys(middleware.route.methods).join(', ')}`);
  } else if (middleware.name === 'router') {
    console.log(`[Server] Router base path: ${middleware.regexp}`);
    middleware.handle.stack.forEach((handler: any, j: number) => {
      if (handler.route) {
        console.log(`[Server] Router route ${j}: ${handler.route.path}`);
        console.log(`[Server] Full path: ${middleware.regexp}${handler.route.path}`);
        console.log(`[Server] Methods: ${Object.keys(handler.route.methods).join(', ')}`);
      }
    });
  }
});

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
  console.log('\n==========================================');
  console.log(`[Server] Server is running on port ${port}`);
  console.log('==========================================\n');
  
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