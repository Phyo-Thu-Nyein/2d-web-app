import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { Subscription } from 'rxjs';
import { Result, TwoDigit } from '../interface/two-digit';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  

  constructor(private apiService: ApiserviceService) { }
  
  resultSub: Subscription = new Subscription();

  // liveDigit: string = '';
  displayDigit: string = '';
  setString: string = '';
  set!: number;
  
  value: string = '';
  date!: Date;
  time!: Date;

  formattedSet!: number;
  finalSet: string = '';
  // numStr: string = '';
  extractedDigit: string = '';
  extractedDigitFinal!: number;

  //HISTORY ROWS DATA
  result: Result[] = [];
  pm12set: string = '';
  pm12value: string = '';
  pm12digit: string = '';
  pm430set: string = '';
  pm430value: string = '';
  pm430digit: string = '';
  
// Example usage
// decimalNum: number = 123.456789;
//position: number = 2;  // Extract the 1st and 3rd digit from the right
extractedSetDigit!: string;
  extractedValueDigit!: string;
  
  ngOnInit(): void {
    this.getLiveResult();
  }

  getLiveResult() {
    var result = this.apiService.get2dResult();
    console.log(result);
    this.resultSub = result.subscribe({
      next: (response: TwoDigit) => {
        // this.liveDigit = response.live?.twod!;
        this.setString = response.live?.set!;
        this.value = response.live?.value!;
        this.date = response.live?.date!;
        this.time = response.live?.time!;
        //GETTING results
        this.result = response.result!;
        
        this.pm12set = this.result[1]?.set!;
        this.pm12value = this.result[1].value!;
        this.pm12digit = this.result[1].twod!;

        this.pm430set = this.result[3].set!;
        this.pm430value = this.result[3].value!;
        this.pm430digit = this.result[3].twod!;

        // console.log(this.resultSub);
        // console.log(this.liveDigit);

        //CHANGE from string to num
        this.set = parseFloat(this.setString);
        this.formattedSet = this.set;
        this.finalSet = this.formattedSet.toFixed(2);
        console.log(this.set);
        console.log(this.value);
        console.log("hello");
        console.log(this.formattedSet.toFixed(2));
        console.log(this.finalSet);
        this.extractedSetDigit = this.extractDigit(this.finalSet, 1);
        this.extractedValueDigit = this.extractDigit(this.value, 4);
        console.log(`The 1st digit from the right in ${this.finalSet} is: ${this.extractedSetDigit}`);
        console.log(`The 3rd digit from the right in ${this.value} is: ${this.extractedValueDigit}`);
    this.displayDigit = `${this.extractedSetDigit}${this.extractedValueDigit}`
    
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  extractDigit(decimalNum: string, position: number) {
    // Convert the decimal number to a string
    // this.numStr = decimalNum.toString();

    // Check if the position is within valid range
    // if (position < 0 || position >= this.numStr.length) {
    //       // Return null if the position is out of range
    // }
    

    // Extract the digit at the specified position
    console.log(decimalNum)
    console.log("length of decimanl is "+decimalNum.length)
    this.extractedDigit = decimalNum.charAt(decimalNum.length - position);
    // console.log(this.extractDigit)
    // return console.log("hii");
    return this.extractedDigit;
}

  
  
// Print the result
// console.log(`The ${position}th digit from the right in ${decimalNum} is: ${extractedDigit}`);

  ngOnDestroy() {
    if (this.resultSub) {
      this.resultSub.unsubscribe();
    }
  }
}
