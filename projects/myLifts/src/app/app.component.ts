import { Component } from '@angular/core';

import { HttpClient} from '@angular/common/http';
import { UserCreateComponent} from '../../src/app/user-create/user-create.component';
import { User } from './../../src/app/classes/user';
import { Observable } from 'rxjs';
import { UsersService} from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'new-app';
  users: User[];
  constructor(private userData:UsersService){}
  ngOnInit(){
  }
}
