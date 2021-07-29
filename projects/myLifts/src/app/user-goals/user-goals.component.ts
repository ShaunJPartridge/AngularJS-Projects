import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, Form } from '@angular/forms';
import { Observable} from 'rxjs';

import { User } from '../classes/user';
import { OneRM } from '../classes/onerm';
import { Exercise } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/app/classes/exercise';
import { Workout } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/app/classes/workout';
import { UsersService } from 'C:/Users/spart/my-angular-apps/projects/myLifts/src/services/users.service';

var MAIN_LIFTS: Array<Exercise> = [{name:'Barbell Squats',reps:1,sets:1,weight:0},
                                     {name:'Bench Press',reps:1,sets:1,weight:0},
                                     {name:'Deadlifts',reps:1,sets:1,weight:0},
                                     {name:'Chin-up/Pull-up',reps:1,sets:1,weight:0},
                                     {name:'Military Press',reps:1,sets:1,weight:0}];

interface RoutineType{
  value: string;
  viewValue: string;
}

interface ExperienceLevel{
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-user-goals',
  templateUrl: './user-goals.component.html',
  styleUrls: ['./user-goals.component.css']
})
export class UserGoalsComponent implements OnInit {

  user: User;
  goalsForm: FormGroup;
  oneRMs: OneRM[];
  percentages = new Float64Array([.50,.55,.60,.65,.70,.75,.80,.85,.90,.95]); //could replace arrays with a set of %'s and weights or 
  perRMs = new Array<number>(10);                                             // an array of maps with the same values
  trainingRanges: string[] = ['','','','',''];
  selectedRoutine: string;
  selectedExperience: string;
  show: boolean = false;
  

  routines: RoutineType[] = [
    {value: 'endurance', viewValue: 'Endurance'},
    {value: 'hypertrophy', viewValue: 'Hypertrophy'},
    {value: 'strength', viewValue: 'Strength'}
  ]

  experiences: ExperienceLevel[] = [
    {value: 'beginner', viewValue:'Beginner (6-12 months exp.)'},
    {value: 'intermediate', viewValue: 'Intermediate (1-2 years exp.)'},
    {value: 'advanced',viewValue:'Advanced (5 years exp.)'},
    {value: 'highly advanced',viewValue:'Highly Advanced (10 years exp.)'}
  ]

  genders: string[] = ['Male','Female','Other'];

  constructor(private userService: UsersService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.user = this.userService.getUser();
    this.oneRMs = [];

    this.goalsForm = this.fb.group({
      gender: '',
      userWeight: '',
      routineType: '',
      expLevel: '',
      oneRM: this.fb.group({
        weight: '',
        reps: '',
        name: ''
      }),
      goals: this.fb.array([])
    });

  }

  goals(): FormArray{
    return this.goalsForm.get('goals') as FormArray;
  }

  addGoal(){
    this.goals().push(this.newGoal());
    console.log(this.goalsForm.value)
  }

  removeGoal(index: number){
    this.goals().removeAt(index);
  }

  newGoal(): FormGroup{
    return this.fb.group({
      name: '',
      sets: 1,// 1 for now because thats how 1RM are going to be created
      reps: '',
      weight: ''
    })
  }
 
  // Method to get the avg of the 3 formulas to calculate users' 1RM
  avgFormula(weight:number,reps:number): number{
    let brzycki = (weight) * (36/(37-reps));
    let epley = (weight) * (1 + (reps/30));
    let baechle = weight * (1 + (0.033 * reps));
    return (brzycki + epley + baechle) / 3;
  }
  
  // Method to calculate a user's 1 RM for an exercise
  getOneRM(weight:number,reps:number): number{
    
    // Get control values
    const exercise = this.goalsForm.get('oneRM').get('name').value
    const lvl = this.goalsForm.get('expLevel').value;

    // Calculate user's 1RM for an exercise using the avg of 3 formulas
    let oneRM = this.avgFormula(weight,reps);
  
    // Push the 1RM of that particular exercise to the 1RM array
    this.oneRMs.push(new OneRM(exercise,Math.ceil(oneRM/5)*5));
    console.log(oneRM.toPrecision(6));

    // Calculate the training percentages based off of that 1RM
    this.calcPercentages(oneRM);

    // Reset the formGroup controls
    this.goalsForm.get('oneRM').reset();

    return oneRM;
  }

  // Method to calculate a user's training weights, using 
  // percentages based off of their 1RM for an exercise.
  calcPercentages(max:number){
    this.percentages.forEach((per,index) => {
      this.perRMs[index] = Math.ceil((per*max)/5)*5
    })
    console.log(this.percentages.length)
  }

  // Method to calculate user's training percentages and training ranges
  // based off of their routine type
  createTrainingRanges(){
    this.user.routine.type = this.goalsForm.get('routineType').value;
    var temp: string = '';
    var tstr: string = '';
    this.trainingRanges.fill("")
    switch(this.user.routine.type){
      case 'endurance':
          this.user.goals.forEach((ex,exIndex) => { 
              this.trainingRanges[exIndex] += `3-5 sets of 15-20 reps @ `;
            this.percentages.subarray(0,4).forEach((num,index) => {
              if(index % 3 == 0){
                tstr += (num * 100).toString();
                temp += Math.ceil((num * ex.weight)/5)*5
              }
              else{
                  tstr += '-'
                  temp += '-'                
              }        
            })
            if(tstr.match(/-.*-/) && temp.match(/-.*-/)){
              tstr = tstr.replace('-','');
              temp = temp.replace('-','');
            }
            this.trainingRanges[exIndex] += `${tstr}% of ${ex.weight}lbs (${temp}lbs).`
            temp = ''
            tstr = ''
            console.log(this.trainingRanges[exIndex]);
          });
          break;
      case 'hypertrophy':
        this.user.goals.forEach((ex,exIndex) => {
            this.trainingRanges[exIndex] += `3-5 sets of 5-15 reps @ `;
          this.percentages.subarray(4,7).forEach((num,index) => {
            console.log(`The training weight for ${ex.name} at ${num}% is:`)
            console.log(num * ex.weight)
            if(index % 2 == 0){
              tstr += (num * 100).toString();
              temp += Math.ceil((num * ex.weight)/5)*5
            }
            else{
                tstr += '-'
                temp += '-'                
            }        
          })
          if(tstr.match(/-.*-/) && temp.match(/-.*-/)){
            tstr = tstr.replace('-','');
            temp = temp.replace('-','');
          }
          this.trainingRanges[exIndex] += `${tstr}% of ${ex.weight}lbs (${temp}lbs).`
          temp = ''
          tstr = ''
        });
          break;
      case 'strength':
        this.user.goals.forEach((ex,exIndex) => {
          this.trainingRanges[exIndex] += `3-5 sets of 1-5 reps @ `;
          this.percentages.subarray(7,10).forEach((num,index) => {
            console.log(`The training weight for ${ex.name} at ${num}% is:`)
            console.log(num * ex.weight)
            if(index % 2 == 0){
              tstr += (num * 100).toString();
              temp += Math.ceil((num * ex.weight)/5)*5
            }
            else{
                tstr += '-'
                temp += '-'                
            }      
          })
          if(tstr.match(/-.*-/) && temp.match(/-.*-/)){
            tstr = tstr.replace('-','');
            temp = temp.replace('-','');
          }
          this.trainingRanges[exIndex] += `${tstr}% of ${ex.weight}lbs (${temp}lbs).`
          temp = ''
          tstr = ''
        });
          break;
    }
  }

  // Method to help user's determine their lifting goals, based of of their experience level.
  createCoreGoals(expLvl:string){
    this.user.goals = new Array<Exercise>();
    this.user.weight = (this.goalsForm.get('userWeight').value).replace('lbs',''); // get user weight w/o lbs to perform calculations
    this.user.gender = this.goalsForm.get('gender').value;
    this.show = true;
    switch(expLvl){
        case 'beginner':{
            MAIN_LIFTS[0].weight = Math.ceil((parseInt(this.user.weight) * 1.2)/5)*5;
            MAIN_LIFTS[1].weight = Math.ceil((parseInt(this.user.weight) * 0.9)/5)*5;
            MAIN_LIFTS[2].weight = Math.ceil((parseInt(this.user.weight) * 1.5)/5)*5;
            MAIN_LIFTS[3].weight = Math.ceil((parseInt(this.user.weight) * 0.9)/5)*5;
            MAIN_LIFTS[4].weight = Math.ceil((parseInt(this.user.weight) * 0.6)/5)*5;
            break;
        }
        case 'intermediate':{
            MAIN_LIFTS[0].weight = Math.ceil((parseInt(this.user.weight) * 1.5)/5)*5;
            MAIN_LIFTS[1].weight = Math.ceil((parseInt(this.user.weight) * 1.1)/5)*5;
            MAIN_LIFTS[2].weight = Math.ceil((parseInt(this.user.weight) * 1.75)/5)*5;
            MAIN_LIFTS[3].weight = Math.ceil((parseInt(this.user.weight) * 1.1)/5)*5;
            MAIN_LIFTS[4].weight = Math.ceil((parseInt(this.user.weight) * 0.75)/5)*5;
            break;
        }
        case 'advanced':{
            MAIN_LIFTS[0].weight = Math.ceil((parseInt(this.user.weight) * 2)/5)*5;
            MAIN_LIFTS[1].weight = Math.ceil((parseInt(this.user.weight) * 1.5)/5)*5;
            MAIN_LIFTS[2].weight = Math.ceil((parseInt(this.user.weight) * 2.4)/5)*5;
            MAIN_LIFTS[3].weight = Math.ceil((parseInt(this.user.weight) * 1.5)/5)*5;
            MAIN_LIFTS[4].weight = Math.ceil((parseInt(this.user.weight) * 0.9)/5)*5;
            break;
        }
        case 'highly advanced':{
            MAIN_LIFTS[0].weight = Math.ceil((parseInt(this.user.weight) * 2.5)/5)*5;
            MAIN_LIFTS[1].weight = Math.ceil((parseInt(this.user.weight) * 1.9)/5)*5;
            MAIN_LIFTS[2].weight = Math.ceil((parseInt(this.user.weight) * 3)/5)*5;
            MAIN_LIFTS[3].weight = Math.ceil((parseInt(this.user.weight) * 1.9)/5)*5;
            MAIN_LIFTS[4].weight = Math.ceil((parseInt(this.user.weight) * 1.15)/5)*5;
            break;
        }
    }
    MAIN_LIFTS.forEach(ex => {
        this.user.goals.push(ex);
    })
    this.user.weight = this.goalsForm.get('userWeight').value;
    
    this.createTrainingRanges();
    
  }

  // Method to reset form controls or the list of training weights and percentages
  // when reset button is clicked.
  reset(){
    if(this.show){
      this.goalsForm['gender'].value = '';
      this.goalsForm['userWeight'].value = '';
      this.goalsForm['routineType'].value = '';
      this.goalsForm['expLevel'].value = '';
    }
    this.oneRMs.pop();
    this.perRMs.slice(0,this.perRMs.length);
  }

  // Method to submit form and update a user's goals and routine.
  onSubmit(){
    console.log(this.goalsForm.value);
    if(this.goalsForm.valid){
      this.goals().controls.forEach(element => {
        this.user.goals.push(element.value);
      });
      this.userService.updateUser(this.user.id,this.user);
      this.goals().clear();
      this.goalsForm.reset();
    }
    console.log(this.user);
  }

}
