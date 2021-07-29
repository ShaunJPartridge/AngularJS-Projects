import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { User } from '../classes/user';
import { Exercise } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/app/classes/exercise';
import { Workout } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/app/classes/workout';
import { Observable} from 'rxjs';

import { UsersService } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/services/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { WriteKeyExpr } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-user-workout',
  templateUrl: './user-workout.component.html',
  styleUrls: ['./user-workout.component.css']
})
export class UserWorkoutComponent implements OnInit {

  user: User;
  colHeaders2: string[] = ['Name', 'Sets', 'Reps', 'Weight'];
  dataSource: MatTableDataSource<Workout>; // was <Exercise>
  today: Date;
  dateString = '';

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.user = this.userService.getUser() // used to be JSON.parse(this.shared.getInfo())
    this.dataSource = new MatTableDataSource<Workout>(this.user?.routine.workouts) // was <Exercise>
    this.today = new Date();
    this.dateString = this.today.toDateString()
  }

  logWorkout(workout: Workout){
    var index = this.user.routine.workouts.indexOf(workout)
    this.user.routine.workouts[index] = workout;
    this.userService.updateUser(this.user.id,this.user);
    this.dataSource.data = [...this.user.routine.workouts];
    console.log(this.dataSource.data)
  }
  

}
