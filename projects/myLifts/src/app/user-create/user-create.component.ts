// This file contains the code that allows users to create, as well as edit their routine.

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

import { User } from '../classes/user';
import { Exercise } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/app/classes/exercise';
import { Workout } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/app/classes/workout';

import { UsersService} from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/services/users.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})

export class UserCreateComponent implements OnInit {
  
  users: User[];
  user: User;
  submitted = false;
  routineForm: FormGroup;

  constructor(private userService: UsersService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.routineForm = this.fb.group({
      routine: this.fb.array([])
    });
    this.user = this.userService.getUser();
    this.addWorkout(); // Initializes routine form with one workout form
    this.addWorkoutExercise(0); // Initializes routine form with one exercise form
    console.log(this.user)
  }

  // Methods for creating and deleting workouts

  routine(){
    return this.routineForm.get("routine") as FormArray;
  }

  newWorkout(): FormGroup{
   return this.fb.group({
    day: ['',Validators.required],
    workout: this.fb.array([])
   });
  }

  addWorkout(){
    this.routine().push(this.newWorkout());
  }

  // method to update user's actual routine
  onSubmit(userroutine){
    this.submitted = true;
    if(this.routineForm.valid){
      this.user.routine.workouts = this.routineForm.get('routine').value;
      this.userService.updateUser(this.user.id,this.user);
      this.routine().clear();
      this.addWorkout();
    }
  }

  removeWorkout(workoutIndex: number){
    this.routine().removeAt(workoutIndex);
  }

  // Methods for creating and deleting exercises

  workoutExercises(workoutIndex: number): FormArray{ // this should just be named workout but we'll leave it as is for now
    return this.routine().at(workoutIndex).get("workout") as FormArray;
  }

  newExercise(): FormGroup{
    return this.fb.group({
      name: '',
      sets: '',
      reps: '',
      weight: ''
    });
  }

  addWorkoutExercise(workoutIndex: number){
    this.workoutExercises(workoutIndex).push(this.newExercise())
  }

  removeWorkoutExercise(workoutIndex: number, exerciseIndex: number){
    this.workoutExercises(workoutIndex).removeAt(exerciseIndex);
  }

  /*refreshUsers(){
    this.userService.getUsers().subscribe(
      data => {
      this.users=data;
    })
  }*/

}