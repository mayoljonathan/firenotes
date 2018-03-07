import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './shared/models';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService, TokenService } from './shared/services/';

import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
  ){
  }

  ngOnInit(){
    let subscriber;
    // Watch for authentication changed in firebase
    this.afAuth.auth.onAuthStateChanged(user=>{
      // if user is truthy then you are logged in, otherwise false
      this.tokenService.isLoggedIn = user ? true : false;
      console.log('Signed in :'+this.tokenService.isLoggedIn);

      if(user){
        // Gets the user data in the firestore
        subscriber = this.authService.getUserData(user.uid)
          .takeWhile(()=> this.tokenService.isLoggedIn) //subscribe/listen realtime until there is a user logged in, otherwise dont listen anymore
          .subscribe((userData:User)=>{
          console.log('Appcomponent');
          console.log(userData);
          this.tokenService.user = userData;
        });
      }

    });
  }
  
}
