import { Workout } from "./workout";

export class Routine{
    type: string;
    workouts: Workout[];

    constructor(){
        this.type = '';
        this.workouts = [];
    }
}