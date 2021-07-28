// This file contains the service wrapper for the application
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  // function to set an item in the browser storage
  public setExercise(key: string,value: string){
    localStorage.setItem(key,value);
  }

  // function to read the value for the specified key item from the browser
  public getExercise(key: string){
    return localStorage.getItem(key);
  }

  // function to remove the item with the specified key from the browser storage
  public removeExercise(key: string){
    localStorage.removeItem(key);
  }

  // function to remove all the items in the storage
  public clear(){
    localStorage.clear();
  }
}
