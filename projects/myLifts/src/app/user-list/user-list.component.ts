import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { Exercise } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/app/classes/exercise';
import { Workout } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/app/classes/workout';
import { Observable} from 'rxjs';

import { UsersService } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/services/users.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  user: User;
  colHeaders1: string[] = ['Day', 'Exercises']
  colHeaders2: string[] = ['Name', 'Sets', 'Reps', 'Weight']
  dataSource: MatTableDataSource<Workout>;

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.user = this.userService.getUser() // used to be JSON.parse(this.shared.getInfo())
    this.dataSource = new MatTableDataSource<Workout>(this.user?.routine.workouts) 
  }

  getData(data){
    console.log(data);
    return new MatTableDataSource<any>(data);
  }


}
