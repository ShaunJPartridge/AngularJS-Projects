import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UsersService } from 'C:/Users/spart/my-angular-apps/projects/new-app/src/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private userService: UsersService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean>{
    return this.userService.isLoggedIn
    .pipe(take(1),
      map((isLoggedIn: boolean) => {
        if(!isLoggedIn){
          this.router.navigate(['/myLifts/login']);
          return false;
        }
        return true;
      })
    )
  }
}
