export class Exercise{
    name: string;
    sets: number;
    reps: number;
    weight: number;

    /*constructor(n: string, s: number, r:number, w:number){
        this.name = n;
        this.sets = s;
        this.reps = r;
        this.weight = w;
    }*/

    constructor(){
        this.name = '';
        this.sets = 0;
        this.reps = 0;
        this.weight = 0;
    }
}