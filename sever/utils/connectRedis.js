import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'redis-11457.c12.us-east-1-4.ec2.cloud.redislabs.com', // Redis Cloud host
  port: 11457, // Redis Cloud port
  password: 'ziUENV005eZOJhc6u5KsImRfUr8Eqcub', // Uncomment and replace 'your_password' with your actual password if authentication is required
});

// Test the connection
redisClient.on('connect', () => {
  console.log('Connected to Redis Cloud');
});

redisClient.on('error', (err) => {
  console.error('Error connecting to Redis Cloud:', err);
});

// Export the Redis client to use it in other modules
export default redisClient;
