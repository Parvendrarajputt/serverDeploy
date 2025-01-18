import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../model/token.js'
import User from '../model/user.js';

dotenv.config();

export const singupUser = async (request, response) => {
    try {
        // const salt = await bcrypt.genSalt();
        // const hashedPassword = await bcrypt.hash(request.body.password, salt);
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const user = { username: request.body.username, name: request.body.name, password: hashedPassword }

        const newUser = new User(user);
        await newUser.save();

        return response.status(200).json({ msg: 'Signup successfull' });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while signing up user' });
    }
}


export const loginUser = async (request, response) => {
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        let match = await bcrypt.compare(request.body.password, user.password);
        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            
            const newToken = new Token({ token: refreshToken });
            await newToken.save();
        
            response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.name, username: user.username });
        
        } else {
            response.status(400).json({ msg: 'Password does not match' })
        }
    } catch (error) {
        response.status(500).json({ msg: 'error while login the user' })

    }
}

export const logoutUser = async (request, response) => {
    const token = request.body.token;
    await Token.deleteOne({ token: token });

    response.status(204).json({ msg: 'logout successfull' });
}
export const authenticateTestUser = async (req, res) => {
    try {
      const testUserCredentials = {
        name: 'TestUser',
        username: 'TestUser',
        password: 'TestUser', // In a real scenario, ensure passwords are hashed
      };
  
      // Check if the test user already exists
      let user = await User.findOne({ username: testUserCredentials.username });
  
      if (!user) {
        // If not, create the test user with hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testUserCredentials.password, salt);
        user = new User({ ...testUserCredentials, password: hashedPassword });
        await user.save();
      }
  
      // Generate access and refresh tokens
      const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
      const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
  
      // Save the refresh token
      const newToken = new Token({ token: refreshToken });
      await newToken.save();
  
      // Send the tokens and user info to the client
      res.status(200).json({
        accessToken,
        refreshToken,
        name: user.name,
        username: user.username,
      });
    } catch (error) {
      res.status(500).json({ msg: 'Error during test user authentication' });
    }
  };
