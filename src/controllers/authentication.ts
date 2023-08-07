//controller for authentication with express 
import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { random, authentication } from '../helpers';
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
}