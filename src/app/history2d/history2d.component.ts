import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/apiservice.service';
import { Subscription } from 'rxjs';
import { Child, TwoHistory } from '../interface/two-history';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-history2d',
  templateUrl: './history2d.component.html',
  styleUrls: ['./history2d.component.css']
})
export class History2dComponent {
  constructor(private apiService: ApiService, private location: Location) { }
  
  resultSub: Subscription = new Subscription();

  
  apiData!: any;

  ngOnInit() {
    this.get2dHistory();
    this.parseTimeStringsToDate()
  }
  
  //get 2d history
  get2dHistory() {
    var result = this.apiService.get2dHistory();
    this.resultSub = result.subscribe({
      next: (response: TwoHistory) => {
        this.apiData = response!;
      }, 
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  // Function to parse time strings into Date objects
  parseTimeStringsToDate(): void {
    for (const item of this.apiData) {
      for (const child of item.child) {
        // Parse time string into Date object
        child.time = new Date(`2000-01-01T${child.time}`);
      }
    }
  }

  ngOnDestroy() {
    if (this.resultSub) {
      this.resultSub.unsubscribe();
    }
  }

  //navigate back 
  navigateBack(): void {
    this.location.back(); // This navigates back to the previous component
  }

}
