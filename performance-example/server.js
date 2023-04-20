const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master process with ID ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for worker exit event
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker process with ID ${worker.process.pid} exited with code ${code} and signal ${signal}`);
    cluster.fork(); // Replace the dead worker
  });
} else {
  // Worker processes create a server and listen on a port
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World!');
  }).listen(8000);

  console.log(`Worker process with ID ${process.pid} is running`);
}