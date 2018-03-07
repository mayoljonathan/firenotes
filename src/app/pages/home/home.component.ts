import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router' ;


import { AuthService,TokenService } from '../../shared/services/';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
  ) { }

  ngOnInit() {
    document.body.style.backgroundColor = '#ECEFF1';
    document.body.style.height = '100%';
  }

  // create a getter, so that it will automatically return user object in tokenService when home component loaded first than retrieving data in cloud firestore(in app.component)
  get userDetails(){
    return this.tokenService.user;
  }

  signOut(){
    this.authService.signOut();
    this.router.navigate(['/sign-in']);
  }

}
