import app from './app';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error: Error) => {
  console.error('[Server] Error:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('[Process] Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  console.error('[Process] Unhandled Rejection:', reason);
  process.exit(1);
}); 