import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  constructor(private userservice: UsersService) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.userservice.isLoggedIn; // was this.isLoggedIn$ = this.userservice.isLoggedIn
  }

  onLogout(){
    this.userservice.logout();
  }

}
