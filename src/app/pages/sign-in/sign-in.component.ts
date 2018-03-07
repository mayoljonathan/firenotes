import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router }  from '@angular/router';

// Third party modules/libraries
import anime from 'animejs';
import * as EmailValidator from 'email-validator';

// Models
import { User } from '../../shared/models/';

// Services/Helpers
import { AuthService } from '../../shared/services/';
import { UIHelper } from '../../shared/helpers/';

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SignInComponent implements OnInit {

  isRegistering: boolean = false; //The sign-in form default state
  hidePassword: boolean = true; 
  errorMessage: string = '';

  isLoading: boolean = false; // In logging in and registering

  user: User;

  constructor(
    private router: Router,
    private authService: AuthService,
    private UIHelper: UIHelper,
  ) { 
    // Set default value for user model
    this.user = new User('','','','',null,null,null,null);
  }

  ngOnInit() {
    document.body.style.backgroundColor = '#039BE5';
  }

  // After view has initialized and rendered
  ngAfterViewInit(){
    // Start animation
    anime({
      targets: '#logo-animation .other-note',
      translateX: (el)=> {
        return el.getAttribute('data-x');
      },
      translateY: (el, i)=> {
        return 50 + (-50 * i);
      },
      scale: (el, i, l)=> {
        return (l - i) + .25;
      },
      rotate: ()=> { return anime.random(-360, 360); },
      duration: ()=> { return anime.random(1200, 1800); },
      delay: 3000,
      direction: 'normal', //normal,reverse,alternate
    });
  }

  // In signing in using email and password
  submitForm(){
    if(!this.isLoading){
      this.errorMessage = '';
      if(this.isRegistering){
        if(this.checkValidForm('signup')){
          // Trim name so that it wont have leading spaces
          this.user.name = this.user.name.trim();
          this.isLoading = true;
          this.authService.signUp(this.user).then(result=>{
            this.isLoading = false;
            this.successLogin(result);
          },err=>{
            this.isLoading = false;
            this.errorMessage = err;
          });
        }
      }else{
        if(this.checkValidForm()){
          this.isLoading = true;
          this.authService.signIn('email', this.user).then((result:any)=>{
            this.successLogin(result);
          },err => {
            this.isLoading = false;
            this.errorMessage = err;
          });
        }
      }
    }
  }

  // In signing in using social network providers
  signInWith(provider: string){
    if(!this.isLoading){
      this.errorMessage = '';
      this.isLoading = true;
      this.authService.signIn(provider).then((result:any)=>{
        this.successLogin(result);
      },err => {
        this.isLoading = false;
        this.errorMessage = err;
      });
    }
  }

  successLogin(result){ 
    this.isLoading = false;
    this.router.navigate(['/home']);
    let msg = `Welcome back, ${result.user.name}!`; // default msg for old accounts
    if(result.msg === 'added'){
      msg = `Welcome to FireNotes! You can now create your notes.`;
    }
    this.UIHelper.showSnackBar(msg, result.msg === 'added' ? 4000 : 3000); //if(result.msg === 'added') then duration is 4 seconds else 3 seconds
  }

  // action is optional, if action is signup means it also requires the form to have a valid name
  checkValidForm(action?){
    if(this.user.email.trim().length == 0 || this.user.password.length == 0){
      return this.UIHelper.showSnackBar('Please input all required credentials', 3000);
    }else if(!EmailValidator.validate(this.user.email)){
      return this.UIHelper.showSnackBar('Email is not valid', 3000);
    }else if(action && action === 'signup' && this.user.name.length === 0){
      return this.UIHelper.showSnackBar('Please input all required credentials', 3000);
    }
    return true;
  }

  toggleForm(){
    this.isRegistering = !this.isRegistering;
  }

}
