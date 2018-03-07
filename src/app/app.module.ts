import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

// Guards
import { AuthGuard } from './auth.guard';

// Components
import { AppComponent } from './app.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

// Modules
import { MaterialModule } from './shared/module/material-module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Helpers & Services
import { AuthService,TokenService } from './shared/services/';
import { UIHelper } from './shared/helpers/';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, and enable offline usage
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
  ],
  providers: [
    AuthService,TokenService, //services
    UIHelper, //helpers
    AuthGuard //guards
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
