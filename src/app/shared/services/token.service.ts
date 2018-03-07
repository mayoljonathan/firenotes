import { Injectable } from '@angular/core';

// Model
import { User } from '../models/';

@Injectable()
export class TokenService {

	isLoggedIn: boolean = false;

	user: User; //cache user details

  constructor(){ 
  }

}
