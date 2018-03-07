import { Injectable } from  "@angular/core";
import { CanActivate , ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import { Observable } from "rxjs";

import { TokenService } from "./shared/services/token.service";

import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor (
    	private router : Router,
		private tokenService : TokenService,
		private afAuth: AngularFireAuth,
    ) { }

    canActivate (route : ActivatedRouteSnapshot,state : RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean{
			// if(state.url === '/sign-in'){
			// 	if(this.tokenService.isLoggedIn){
			// 		this.router.navigate(['/home']);
			// 		return;
			// 	}else{
			// 		return true;
			// 	}
			// }else{
				
			// }
			// Permit going to home component if user is logged_in
			// if(this.tokenService.isLoggedIn){
			// 	// this.router.navigate(['/home']);
			// 	return true;
			// }
			// // otherwise navigate to sign-in component
			// this.router.navigate(['/sign-in']);
			// return false;

			// Since firebase authentication change takes time, canActivate function will trigger first before the this.tokenService.isLoggedIn, so i will be using this
			// refer to https://github.com/angular/angularfire2/issues/282
			return this.afAuth.authState
				.take(1)
				.map((authState) => !!authState)
				.do(authenticated => {
					if (!authenticated){
						this.router.navigate(['/sign-in'])
						return false;
					} 
					// else {
					// 	this.router.navigate(['/home'])
					// 	return false;
					// }
				});

    }
}