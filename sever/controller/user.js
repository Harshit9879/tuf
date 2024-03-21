import UserModel from '../model/User.js';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/connectRedis.js';

// Controller function to create a new user
export const createUser = async (req, res) => {
  try {
    // Extract data from the request body
    const { username, code_language, input_code } = req.body;

    // Create a new user using the UserModel
    const user = await UserModel.create({
      username,
      code_language,
      input_code,
    });

    // Return the newly created user
    return res.status(201).json(user);
  } catch (error) {
    // If an error occurs, return an error response
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsersFromCache = async (req, res, next) => {
  try {
    // Extract pagination parameters from the query string
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to page size of 10 if not specified

    // Calculate the offset based on the page number and page size
    const offset = (page - 1) * pageSize;

    // Generate a unique key for caching based on page and pageSize
    const cacheKey = `users_${page}_${pageSize}`;

    // Check if users are cached for the given pagination
    const cachedUsers = await redisClient.get(cacheKey);
    if (cachedUsers) {
      // If cached, return the cached users
      return res.status(200).json(JSON.parse(cachedUsers));
    } else {
      // If not cached, proceed to the next middleware function
      next();
    }
  } catch (error) {
    console.error('Error fetching users from cache:', error);
    // Call the next middleware function on error
    next(error);
  }
};

// Controller function to fetch paginated list of users
export const getUsers = async (req, res) => {
  try {
    // Extract pagination parameters from the query string
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to page size of 10 if not specified

    // Calculate the offset based on the page number and page size
    const offset = (page - 1) * pageSize;

    // Fetch users from the database with pagination
    const users = await UserModel.findAll({
      limit: pageSize,
      offset: offset,
    });

    // Generate a unique key for caching based on page and pageSize
    const cacheKey = `users_${page}_${pageSize}`;

    // Cache the paginated users
    redisClient.set(cacheKey, JSON.stringify(users));
    await redisClient.expire(cacheKey, 60);

    // Return the paginated list of users
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users from database:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
