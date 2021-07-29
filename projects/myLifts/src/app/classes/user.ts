import { Exercise } from "./exercise";
import { Workout } from "./workout";
import { Routine } from "./routine";

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

}