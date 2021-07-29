import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserRoutineComponent } from './user-routine/user-routine.component';
import { UserWorkoutComponent } from './user-workout/user-workout.component';
import { UserGoalsComponent } from './user-goals/user-goals.component';
import { AuthGuardService } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/services/auth-guard.service';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'myLifts/login'},
  {path: 'myLifts', component: LoginComponent},
  {path: 'myLifts/home', component: HomeComponent, canActivate: [AuthGuardService]},
  {path: 'myLifts/routine', component: UserRoutineComponent, canActivate: [AuthGuardService],
    children: [{path: 'create', component: UserCreateComponent},
               {path: 'edit', component: UserEditComponent},
               {path: 'view', component: UserListComponent},
               {path: '', pathMatch:'full', component: UserCreateComponent}]
  },
  {path: 'myLifts/goals', component: UserGoalsComponent, canActivate: [AuthGuardService]},
  {path: 'myLifts/log-workout', component: UserWorkoutComponent, canActivate: [AuthGuardService]},
  {path: 'myLifts/edit-routine', component: UserEditComponent, canActivate: [AuthGuardService]},
  {path: 'myLifts/view-routine', component: UserListComponent, canActivate: [AuthGuardService]},
  {path: 'myLifts/update-goals', component: UserEditComponent, canActivate: [AuthGuardService]},
  {path: 'myLifts/login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
