import { Exercise } from "./exercise";
import { Workout } from "./workout";
import { Routine } from "./routine";

const MAIN_LIFTS: Array<Exercise> = [{name:'Barbell Squats',reps:1,sets:1,weight:0},
                                     {name:'Bench Press',reps:1,sets:1,weight:0},
                                     {name:'Deadlifts',reps:1,sets:1,weight:0},
                                     {name:'Chin-up/Pull-up',reps:1,sets:1,weight:0},
                                     {name:'Military Press',reps:1,sets:1,weight:0}];

export class User {
    
    id: number;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    weight: string;
    gender: string;
    routine: Routine;
    goals: Exercise[] = [];
    
    constructor(){ 
        this.id = 0;
        this.email = ''; 
        this.password = ''; 
        this.firstname = ''; 
        this.lastname = '';
        this.weight = "";
        this.gender = "";
        this.routine = new Routine();
        this.goals = [];  
    }

    createCoreGoals(expLvl:string){
        switch(expLvl){
            case 'beginner':{
                MAIN_LIFTS[0].weight = (Math.ceil(Number(this.weight) * 1.2/5)*5);
                MAIN_LIFTS[1].weight = (Math.ceil(Number(this.weight) * 0.9/5)*5);
                MAIN_LIFTS[2].weight = (Math.ceil(Number(this.weight) * 1.5/5)*5);
                MAIN_LIFTS[3].weight = (Math.ceil(Number(this.weight) * 0.9/5)*5);
                MAIN_LIFTS[4].weight = (Math.ceil(Number(this.weight) * 0.6/5)*5);
                break;
            }
            case 'intermediate':{
                MAIN_LIFTS[0].weight = (Math.ceil(Number(this.weight) * 1.5/5)*5);
                MAIN_LIFTS[1].weight = (Math.ceil(Number(this.weight) * 1.1/5)*5);
                MAIN_LIFTS[2].weight = (Math.ceil(Number(this.weight) * 1.75/5)*5);
                MAIN_LIFTS[3].weight = (Math.ceil(Number(this.weight) * 1.1/5)*5);
                MAIN_LIFTS[4].weight = (Math.ceil(Number(this.weight) * 0.75/5)*5);
                break;
            }
            case 'advanced':{
                MAIN_LIFTS[0].weight = (Math.ceil(Number(this.weight) * 2/5)*5);
                MAIN_LIFTS[1].weight = (Math.ceil(Number(this.weight) * 1.5/5)*5);
                MAIN_LIFTS[2].weight = (Math.ceil(Number(this.weight) * 2.4/5)*5);
                MAIN_LIFTS[3].weight = (Math.ceil(Number(this.weight) * 1.5/5)*5);
                MAIN_LIFTS[4].weight = (Math.ceil(Number(this.weight) * 0.9/5)*5);
                break;
            }
            case 'highly advanced':{
                MAIN_LIFTS[0].weight = (Math.ceil(Number(this.weight) * 2.5/5)*5);
                MAIN_LIFTS[1].weight = (Math.ceil(Number(this.weight) * 1.9/5)*5);
                MAIN_LIFTS[2].weight = (Math.ceil(Number(this.weight) * 3/5)*5);
                MAIN_LIFTS[3].weight = (Math.ceil(Number(this.weight) * 1.9/5)*5);
                MAIN_LIFTS[4].weight = (Math.ceil(Number(this.weight) * 1.15/5)*5);
                break;
            }
        }
        MAIN_LIFTS.forEach(ex => {
            this.goals.push(ex);
        })
        this.goals.forEach(ex => {
            console.log(ex);
        })
    }
    
    
}