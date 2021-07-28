import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, Form } from '@angular/forms';
import { config } from 'process';
import { first } from 'rxjs/operators';

import { UsersService } from 'C:/Users/spart/my-angular-apps/projects/new-app/src/services/users.service';
import { Workout } from '../classes/workout';
import { Routine } from '../classes/routine';

import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { Exercise } from '../classes/exercise';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isTrue: boolean = false;
  loggedIn: boolean;
  formGroup: FormGroup;
  regformGroup: FormGroup;
  isRegistered: boolean = true;
  home: HomeComponent;
  userdata: any;

  constructor(private userService:UsersService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
      this.formGroup = this.fb.group({
        email: new FormControl('',[Validators.email, Validators.required]),
        password: new FormControl('',[Validators.min(5), Validators.required])
      })

      this.regformGroup = this.fb.group({
        email: new FormControl('',[Validators.email, Validators.required]),
        password: new FormControl('',[Validators.min(5), Validators.required]),
        firstname: new FormControl('',[Validators.required]),
        lastname: new FormControl('',[Validators.required]),
        weight: '',
        goals: []
      })
  }

  /*ngOnDestroy(){
  }*/
  
  validField(field: string){
    return (
      (!this.formGroup.get(field).valid && this.formGroup.get(field).touched) ||
      (this.formGroup.get(field).untouched && this.loggedIn)
    );
  }

  register(){
    this.userService.createUser(this.regformGroup.value);
    this.isRegistered = true;
  }

  onSubmit(){
    if (this.formGroup.valid){
      this.userService.login(this.formGroup.value);
    }
    this.loggedIn = true;
  }

  changeTheme(){
    this.isTrue = !this.isTrue;
  }

}
