//controller for authentication with express 
import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { random, authentication } from '../helpers';


//login user with email and password
export const login = async (req: express.Request, res: express.Response) => {
   try {
      const { email, password } = req.body;
      //check if user has email and password
      if (!email || !password) {
         return res.sendStatus(403);
      }

      const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

      if (!user) {
         res.sendStatus(400);
      }

      const expectedHash = authentication(user.authentication.salt, password);

      if (user.authentication.password !== expectedHash) {
         return res.sendStatus(403);
      }

      const salt = random();
      user.authentication.sessionToken = salt;
   } catch (error) {
      console.error(error);
      res.sendStatus(400);
   }


};
//register the user 
export const register = async (req: express.Request, res: express.Response) => {
   try {
      const { email, password, username } = req.body;
      //checks all are required
      if (!email || !password || !username) {
         return res.sendStatus(400);
      }
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
         return res.sendStatus(400);
      }
      const salt = random();
      const user = await createUser({
         email,
         username,
         authentication: {
            salt,
            password: authentication(salt, password),
         },
      });
      return res.sendStatus(200).json().end();

   } catch (error) {
      console.log(error);
      return res.sendStatus(400);

   }
};