import { Component, OnInit } from '@angular/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

import { UsersService } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/services/users.service';
import { UserGoalsComponent } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/app/user-goals/user-goals.component';
import { Workout } from '../classes/workout';
import { FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { User } from '../classes/user';
import { Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;
  userData: any;
  goalComp: UserGoalsComponent;
  progresses: number[] = [];
  progMap = new Map();
  mode: ProgressSpinnerMode = 'determinate';

  constructor(private userService: UsersService, private fb: FormBuilder, private router: Router) { 
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.goalComp = new UserGoalsComponent(this.userService,this.fb);
    this.calcProgess();
    console.log(this.user)
  }

  getWorkouts(): Workout[]{
    return this.user.routine.workouts as Workout[];
  }

  calcProgess(){
    if(this.user.goals && this.user.routine){
    let tArray = this.user.goals;

    this.user.goals.forEach((g) => {
      this.user.routine.workouts.forEach((w,index) => {
        w.workout.forEach((ex) => {
          if(ex.name == g.name){
            let val = this.goalComp.avgFormula(ex.weight,ex.reps)/g.weight;
            this.progresses.push(val * 100);
            this.progMap.set(ex.name,val * 100);
          }
        })
      })
    })
    /*this.user.routine.workouts.forEach((el,index) => {
      el.workout.forEach((ex) => {
        tArray.filter((g) => el.workout.some(g1 => g.name === g1.name)).forEach((t,index) => 
        { let val = this.goalComp.avgFormula(ex.weight,ex.reps)/t.weight;
          this.progresses.push(val * 100);
          this.progMap.set(ex.name,val * 100);
        });
      });
    });*/
   }
  }
}
