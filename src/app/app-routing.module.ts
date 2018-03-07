import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
 
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

// AuthGuard
import { AuthGuard } from './auth.guard';
import { TokenService } from './shared/services/';
 
const appRoutes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent } //redirect whenever path is not existing 
];

// const appRoutes: Routes = [
//   { path: '', canActivate: [AuthGuard], children: [
//     { path: 'sign-in', component: SignInComponent },
//     { path: 'home', component: HomeComponent },
//     { path: '**', component: PageNotFoundComponent } //redirect whenever path is not existing 
//   ]}
// ];
 
@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- set to true, debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}