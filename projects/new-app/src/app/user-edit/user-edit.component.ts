// This file contains the code for viewing the user's routine, for now

import { Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { User } from '../classes/user';
import { Exercise } from 'C:/Users/spart/my-angular-apps/projects/new-app/src/app/classes/exercise';
import { Workout } from 'C:/Users/spart/my-angular-apps/projects/new-app/src/app/classes/workout';
import { Observable} from 'rxjs';

import { UsersService } from 'C:/Users/spart/my-angular-apps/projects/new-app/src/services/users.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';

// delete this ??
const Exercise_SCHEMA = {
  "name": "text",
  "sets": "number",
  "reps": "number",
  "weight": "number",
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User;
  colHeaders1: string[] = ['Day','Exercises']
  colHeaders2: string[] = ['Name', 'Sets', 'Reps', 'Weight', 'Edit']
  dataSource: MatTableDataSource<Workout>;
  selection: SelectionModel<Workout>;
  innerSelection: SelectionModel<Exercise>;
  clickedRows: Set<Workout>;
  dataSchema = Exercise_SCHEMA;
  rowEnabled: boolean = false;
  edit: boolean = false;
  
  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.user = this.userService.getUser()
    this.dataSource = new MatTableDataSource<Workout>(this.user?.routine.workouts)
    this.selection = new SelectionModel<Workout>(true,[]);
    this.innerSelection = new SelectionModel<Exercise>(true,[])
  }

  addWorkout(name:string, sets:number, reps:number, weight:number){
    //this.user.routine.push(new Exercise(name,sets,reps,weight))
  }

  addExercise(row){ // pass in the index of the workout or row to add an exercise to
    console.log(this.user.routine.workouts[row].workout);
    var temp = this.user.routine.workouts[row].workout.slice();
    temp.push(new Exercise());
    this.user.routine.workouts[row].workout = temp;
    console.log(this.user.routine.workouts[row].workout);
  }

  removeExercise(row, exercise, table:MatTable<Exercise>){
    var index = this.user.routine.workouts[row].workout.indexOf(exercise); // print exercise index in particular row
    this.user.routine.workouts[row].workout.splice(index,1)
    table.renderRows()
    console.log(this.user.routine)
  }

  // delete this method??
  allSelected(){
    //const amtSelected = this.selection.selected.length;
    //const amtRows = this.dataSource.data.length;
    //return amtSelected === amtRows;
  }

  
  updateRoutine(){
    this.user.routine.workouts = this.user.routine.workouts.map(item => {
      let item2 = Array.from(this.selection.selected).find(i2 => i2.day === item.day);
      return item2 ? {...item, ...item2} : item;
    })
    console.log(this.user.routine);
    this.userService.updateUser(this.user.id,this.user);
  }

  deleteRoutine(){
    this.user.routine.workouts.splice(0,this.user.routine.workouts.length);
    this.userService.updateUser(this.user.id,this.user);
  }

  getData(data){
    console.log(data);
    return new MatTableDataSource<any>(data);
  }

}
