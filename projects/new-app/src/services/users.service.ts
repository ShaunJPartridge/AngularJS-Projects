import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, mergeMap, filter, map } from 'rxjs/operators';
import { baseUrl } from 'C:/Users/spart/my-angular-apps/projects/new-app/src/environments/environment';
import { User } from 'C:/Users/spart/my-angular-apps/projects/new-app/src/app/classes/user';
import { Routine } from "../app/classes/routine";
import { error } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import { SharedService } from 'C:/Users/spart/my-angular-apps/projects/new-app/src/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private email = new BehaviorSubject<string>(localStorage.getItem('email'));
  private password = new BehaviorSubject<string>(localStorage.getItem('password'));

  user: User = new User();
  users: Observable<User[]>;

  constructor(private http:HttpClient, private router: Router, private shared: SharedService) {
  }

  // Method to share user amongst components.
  getUser(){
    this.user = JSON.parse(localStorage.getItem('user'));
    return this.user;
  }

  // Method to get user from API server using JWT and then setting the user for the application.
  setUser(user: User,token: string){
    let headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

    return this.http.get<User>(`${baseUrl}users?email=` + user.email, { headers})
    .subscribe(res => {
      console.log(res)
      if(res){
        this.user = res[0];
        console.log(this.user)
        localStorage.setItem('user',JSON.stringify(this.user));
        console.log(`Hello ${this.user.firstname}!`);
        this.loginStatus.next(true);
        localStorage.setItem('loginStatus','1');
        localStorage.setItem('email',this.user.email);
        localStorage.setItem('password',this.user.password);
        this.email.next(localStorage.getItem('email'));
        this.password.next(localStorage.getItem('password'));
        if(!user.goals){
          this.router.navigate(['myLifts/goals']);
        }
        else{
          this.router.navigate(['myLifts/home']);
        }
      }
      else{
        console.log('Login was unsuccessful');
      }
    })
  }
  
  // Method to get login status
  get isLoggedIn(){
    return this.loginStatus.asObservable();
  }

  // Method to get the email of the current user.
  get currentUserEmail(){
    return this.email.asObservable();
  }

  // Method to get the password of the current user.
  get currentUserPassword(){
    return this.password.asObservable();
  }

  // Method to get all of the users from API server.
  getUsers(): Observable<User[]>{
    let token = this.getToken();
    let headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

    return this.http.get<User[]>(`${baseUrl}users`,{ headers })
    .pipe(
      catchError(this.errorHandler)
    );
  }

  // Method to get the JWT from localStorage to access the data in API server.
  getToken(): string{
    return localStorage.getItem('token');
  }

  // Method to login user.
  login(user){
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    return this.http.post<string>(`${baseUrl}auth/login`,JSON.stringify(user),{ headers })
    .subscribe(res => {
      if(res){
        localStorage.setItem('token',res);
        this.setUser(user,res)
      }
    })
  }

  // Method to logout user.
  logout(){
    this.loginStatus.next(false);
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('token');
    localStorage.setItem('loginStatus','0');
    console.log(`Goodbye ${this.user.firstname}!`);
    this.router.navigate(['myLifts/login']);
  }

  // Method to check if user is logged in or not.
  checkLoginStatus(): boolean{
    var loginStat = localStorage.getItem('loginStatus')
    if (loginStat == '1'){
      return true;
    }
    return false;
  }


  // Method to update the current user's info.
  updateUser(id, user){
    let token = this.getToken();
    let headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

    return this.http.put<User>(`${baseUrl}users/${id}`, user, { headers }).subscribe(
      data => {
        localStorage.setItem('user',JSON.stringify(data))
        console.log(data);
        (Error) => console.log(Error);
      }
    )
  }

  // Method to create a new user.
  createUser(user){
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    this.user = user; 
    const body = JSON.stringify(this.user);
    
    return this.http.post<User>(`${baseUrl}auth/register`,body,{ headers }).subscribe(
      (Response) => console.log(Response),
      (Error) => console.log(Error)
    )
  }

  // Method to delete a user.
  deleteuser(id){
    let token = this.getToken();
    let headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

    return this.http.delete<User>(`${baseUrl}users/${id}`, { headers })
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // Method to print the type of error to the user.
  errorHandler(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // get client-side error
      errorMessage = error.error.message;
    }
    else {
      // get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
    
  }
}
