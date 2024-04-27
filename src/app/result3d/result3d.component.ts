import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/apiservice.service';
import { Subscription } from 'rxjs';
import { Datum, ThreeResults } from '../interface/three-result';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-result3d',
  templateUrl: './result3d.component.html',
  styleUrls: ['./result3d.component.css']
})
export class Result3dComponent {
  constructor(private apiService: ApiService, private location: Location) { }
  
  resultSub: Subscription = new Subscription();

  resultList: Datum[] = [];

  ngOnInit() {
    this.get3dResults();
  }

  get3dResults() {
    var result = this.apiService.get3dResult();
    this.resultSub = result.subscribe({
      next: (response: ThreeResults) => {
        this.resultList = response.data!;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  //navigate back 
  navigateBack(): void {
    this.location.back(); // This navigates back to the previous component
  }

  ngOnDestroy() {
    if (this.resultSub) {
      this.resultSub.unsubscribe();
    }
  }
}
