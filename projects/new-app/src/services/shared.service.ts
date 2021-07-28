import { Injectable } from '@angular/core';
import { User } from 'C:/Users/spart/my-angular-apps/projects/new-app/src/app/classes/user'

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userInfo: any;
  user: any;

  constructor() { }

  setInfo(data){
    this.userInfo = data;
  }

  getInfo(){
    return this.userInfo;
  }

  setUser(user){
    this.user = user;
  }

  getUser(){
    return this.user;
  }

  resetInfo(data){
    this.setInfo(JSON.stringify(data));
  }
}
