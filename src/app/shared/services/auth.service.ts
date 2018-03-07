import { Injectable } from '@angular/core';
// Models
import { User } from '../models/user';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

// Needed for querying once in firestore or in realtime database
import 'rxjs/add/operator/take';

@Injectable()
export class AuthService {

  user: User;

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
  ) { 
  }

  //credentials is optional
  signIn(provider: string, credentials?: User){
    
    let authProvider:any = 'email'; //'any' is can be any data type
    if(provider === 'facebook'){
      authProvider = new firebase.auth.FacebookAuthProvider();
    }else if(provider === 'google'){
      authProvider = new firebase.auth.GoogleAuthProvider();
    }else if(provider === 'twitter'){
      authProvider = new firebase.auth.TwitterAuthProvider();
    }else if(provider === 'github'){
      authProvider = new firebase.auth.GithubAuthProvider();
    }

    return new Promise((resolve,reject)=>{
      if(provider === 'email'){
        // Authentication for email and password
        this.afAuth.auth.signInWithEmailAndPassword(credentials.email,credentials.password).then(result=>{
          this.validateUser(result, 'email').then(response=>{
            resolve(response);
          },error=> reject(error));
        },error=> reject(error));
      }else{
        // Authentication for social network providers
        this.afAuth.auth.signInWithPopup(authProvider).then(result => {
          // Checks user if it is a new or an old account
          // If its a new account then register and login it, otherwise login only
          this.validateUser(result, 'social').then(response=>{
            resolve(response);
          },error=> reject(error));
        },error=> reject(error));
      }

    });
  }

  signUp(user:User){
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(result=>{
      // update profileData in the firebase authentication so that user will have a displayName
      // because a new account in the firebase authentication will have no displayName and a photoURL
      return this.afAuth.auth.currentUser.updateProfile({
        displayName: user.name,
        photoURL: null,
      }).then(()=>{
        return this.validateUser(result, 'email');
      },err=>{ return err});
    });
  }

  // type = so that i can know whether its a signin(social network) or a signup(email and password)
  // because signing in using social network and signup/signin(email and password) returns a different object
  // try console.log(result) in signing in using social network and also signin/signup(email and password)
  validateUser(result, type){
    return new Promise((resolve,reject)=>{
      // pass result data to this.user so that this.user is global and can be called from other functions
      this.passUserData(result,type);
      // check if this account exist or not in the cloud firestore database
      // put .take(1) so that it will query once
      this.getUserData(this.user.uid).take(1).subscribe(userData=>{
        // userData returns an object if user_uid was found at users document, meaning user is an old account
        // userData returns null if it was not found , meaning user is a new account
        if(userData){ //return an object that account is an old account and can login
          resolve({msg: 'logged_in', user: userData});
        }else{ //return an object that account has been added and account can login
          this.addUserData(this.user).then(()=>{
            resolve({msg: 'added', user: this.user});
          },error=> reject(error));
        }
      });

    });
  }

  // Just creating a function that will passUserData to a global variable
  passUserData = (res,type)=>{
    let data = type === 'email' ? res : res.user;
    const firebaseUID = data.uid;
    const provider = data.providerData[0];
    this.user = Object.assign({
        uid: firebaseUID,
        name: data.displayName,
        email: data.email,
        photoURL: data.photoURL,
        provider: provider.providerId,
        providerUID: provider.uid,
        dateCreated: firebase.firestore.FieldValue.serverTimestamp() //returns timestamp to be saved in the firestore
    });
  }

  addUserData(user:User){
    return this.afs.collection<User>('users').doc(user.uid).set(user);
  }

  getUserData(user_uid){
    return this.afs.collection<User>('users').doc(user_uid).valueChanges();
  }

  signOut(){
    return this.afAuth.auth.signOut();
  }

}
