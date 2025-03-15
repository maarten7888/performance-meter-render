import app from './app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[Server] Running on port ${port}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Global error handlers
process.on('uncaughtException', (error: Error) => {
  console.error('[Server] Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('[Server] Unhandled Rejection:', reason);
  process.exit(1);
}); 