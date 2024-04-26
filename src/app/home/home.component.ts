import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/apiservice.service';
import { interval, Subscription, TeardownLogic } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Result, TwoDigit } from '../interface/two-digit';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  resultSub: Subscription = new Subscription();
  constructor(private apiService: ApiService) {}

  //Testing current date time
  currentDateTime!: Date;
  timerSubscription: Subscription = new Subscription();

  // Live data
  displayDigit: string = '';
  liveSet: string = '';
  liveValue: string = '';
  // date!: Date;
  // time!: Date;

  //Get live data every 10 seconds
  data?: TwoDigit;

  //update morning & evening content
  isEarly?: boolean;
  
  //update morning
  morningTime!: Date;
  morningResult: Result[] = [];
  isBadgeVisible: boolean = false;
  serverTime!: Date;
  //update evening
  eveningTime!: Date;
  eveningResult: Result[] = [];

  //wait till 2pm to start box-flashing again
  isServerBefore2pm?: boolean;

  //HISTORY ROWS DATA
  result: Result[] = [];
  pm12set: string = '';
  pm12value: string = '';
  pm12digit: string = '';
  pm430set: string = '';
  pm430value: string = '';
  pm430digit: string = '';

  ngOnInit(): void {
    this.liveTime();
    this.getLiveResult();
    // GET the live data every 30 seconds
    this.resultSub = interval(30000)
      .pipe(switchMap(() => this.apiService.get2dResult()))
      .subscribe((response: TwoDigit) => {
        this.data = response;
        console.log("Api is called every 30 sec");
      });

    this.getTodayResult();
    this.updateMorningSession();
    this.updateEveningSession();
  }

  //timer subscription
  liveTime() {
    // Update currentDateTime every second
    this.timerSubscription = interval(1000) // 1 second
      .subscribe(() => {
        this.currentDateTime = new Date();
      });
  }

  getLiveResult() {
    var result = this.apiService.get2dResult();
    this.resultSub = result.subscribe({
      next: (response: TwoDigit) => {
        this.result = response.result!;
        this.displayDigit = response.live?.twod!;
        this.liveSet = response.live?.set!;
        this.liveValue = response.live?.value!;
      },
    });
  }

  getTodayResult() {
    var result = this.apiService.get2dResult();
    this.resultSub = result.subscribe({
      next: (response: TwoDigit) => {
        //GETTING today's results
        this.result = response.result!;

        this.pm12set = this.result[1]?.set!;
        this.pm12value = this.result[1].value!;
        this.pm12digit = this.result[1].twod!;

        this.pm430set = this.result[3].set!;
        this.pm430value = this.result[3].value!;
        this.pm430digit = this.result[3].twod!;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  //UPDATE MORNING RESULT IN MAIN CONTENT, H1
  updateMorningSession() {
    var result = this.apiService.get2dResult();
    this.resultSub = result.subscribe({
      next: (response: TwoDigit) => {
        //get the morning data
        this.serverTime = response.live?.time!;
        this.morningResult = response.result!;
        this.morningTime = this.morningResult[1].stock_datetime!;

        //parse to date object for comparison
        const serverTimeDateObject = new Date(this.serverTime);
        const stockTimeDateObject = new Date(this.eveningTime);

        const h1 = document.querySelector('h1');
        this.compareServerTimeToOpenTime(
          serverTimeDateObject,
          stockTimeDateObject
        );
        this.compareServerTimeToSpecificTime(serverTimeDateObject, 14, 0);

        if (this.isServerBefore2pm && this.isEarly == false) {
          this.displayDigit = this.pm12digit;
          console.log('>>>>> MORNING WORKING <<<<<');
          h1?.removeAttribute('class');
          this.isBadgeVisible = true;
        } else {
          this.displayDigit = response.live?.twod!;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  //UPDATE EVENING RESULT IN MAIN CONTENT, H1
  updateEveningSession() {
    var result = this.apiService.get2dResult();
    this.resultSub = result.subscribe({
      next: (response: TwoDigit) => {
        //get the evening data
        this.serverTime = response.live?.time!;
        this.eveningResult = response.result!;
        this.eveningTime = this.eveningResult[3].stock_datetime!;

        //parse to date object for comparison
        const serverTimeDateObject = new Date(this.serverTime);
        const stockTimeDateObject = new Date(this.eveningTime);

        const h1 = document.querySelector('h1');
        this.compareServerTimeToOpenTime(
          serverTimeDateObject,
          stockTimeDateObject
        );
        if (this.isEarly == false) {
          this.displayDigit = this.pm430digit;
          console.log('>>>>> EVENING WORKING <<<<<');
          h1?.removeAttribute('class');
          this.isBadgeVisible = true;
        } else {
          this.displayDigit = response.live?.twod!;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }


  compareServerTimeToSpecificTime(
    serverTime: Date,
    hours: number,
    minutes: number
  ): void {
    // Create a Date object for the specific time (2 PM)
    const specificTime = new Date(serverTime);
    specificTime.setHours(hours);
    specificTime.setMinutes(minutes);

    // Compare the server time with the specific time
    if (serverTime < specificTime) {
      this.isServerBefore2pm = true;
      console.log('The server time is before 2 PM.');
    } else {
      this.isServerBefore2pm = false;
      console.log('The server time is after 2 PM.');
    }
  }

  compareServerTimeToOpenTime(serverTime: Date, stockDateTime: Date) {
    if (!(serverTime instanceof Date)) {
      console.error('serverTime is not a Date object.');
      return;
    }

    // Compare the server time with the open time
    if (serverTime < stockDateTime) {
      this.isEarly = true;
      console.log('The server time is before the stock date time.');
    } else {
      this.isEarly = false;
      console.log('The server time is after the stock date time.');
    } 
  }

  ngOnDestroy(): void {
    if (this.resultSub) {
      this.resultSub.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
