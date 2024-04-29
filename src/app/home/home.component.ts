import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/apiservice.service';
import { interval, of, Subscription, TeardownLogic } from 'rxjs';
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

  //Loading for skeleton loader
  isLoading: boolean = true;

  //Testing current date time
  currentDateTime!: Date;
  timerSubscription: Subscription = new Subscription();

  // Live data
  displayDigit: string = '';
  liveSet: string = '';
  liveValue: string = '';

  //Get live data every 30 seconds
  data?: TwoDigit;

  //update morning & evening content
  isEarly?: boolean;
  //update the displayed Big two digit status
  isFlashing?: boolean;
  bigTwoDigits = document.getElementById('big-two-digits');
  //starts flashing again after 2pm/ 14hr
  twoPm: string = "14:00:00";


  //update morning
  morningTime: string = '';
  morningResult: Result[] = [];
  isBadgeVisible: boolean = false;
  serverTime!: Date;
  serverTimeString: string = '';
  //update evening
  eveningTime: string = '';
  eveningResult: Result[] = [];

  //wait till 2pm to start box-flashing again
  isServerBefore2pm?: boolean;

  //TODAY ROWS DATA
  result: Result[] = [];
  pm12set: string = '';
  pm12value: string = '';
  pm12digit: string = '';
  pm430set: string = '';
  pm430value: string = '';
  pm430digit: string = '';
  //MODERN ROWS DATA
  am11set: string = '';
  am11value: string = '';
  am11digit: string = '';
  pm3set: string = '';
  pm3value: string = '';
  pm3digit: string = '';

  ngOnInit(): void {
    this.liveTime();
    this.getLiveResult();
    this.getTodayResult();
    this.updateEveningSession();
    this.updateMorningSession();

    // GET the live data every 20 seconds ONLY on Mondays to Fridays
    this.resultSub = interval(20000)
      .pipe(
        switchMap(() => {
          if (this.isWeekday()) {
            return this.apiService.get2dResult();
          } else {
            console.log("It's weekend, baby");
            return of(null);
          }
        })
      )
      .subscribe((response: TwoDigit | null) => {
        if (response) {
          this.data = response;
          if (this.isEarly) {
            this.displayDigit = this.data.live?.twod!;
            this.liveSet = this.data.live?.set!;
            this.liveValue = this.data.live?.value!;
            console.log('Api is called every 20 sec' + this.displayDigit);
          }
        }
        this.isLoading = false;
      });
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
        //11:00am digit
        this.am11set = this.result[0].set!;
        this.am11value = this.result[0].value!;
        this.am11digit = this.result[0].twod!;
        //12:01pm digit
        this.pm12set = this.result[1]?.set!;
        this.pm12value = this.result[1].value!;
        this.pm12digit = this.result[1].twod!;
        //03:00pm digit
        this.pm3set = this.result[2].set!;
        this.pm3value = this.result[2].value!;
        this.pm3digit = this.result[2].twod!;
        //4:30pm digit
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
        this.serverTime = response.server_time!;
        this.morningResult = response.result!;
        this.morningTime = this.morningResult[1].open_time!;

        //extract the hours, minutes and parse to string
        this.serverTimeString = this.extractTime(this.serverTime);

        this.compareServerTimeTo2PM(this.serverTimeString, this.twoPm);
        this.compareServerTimeWithOpenTime(this.serverTimeString, this.morningTime);

        if (this.isServerBefore2pm && this.isEarly == false) {
          this.displayDigit = this.pm12digit;
          console.log('>>>>> MORNING WORKING <<<<<');
          this.isFlashing = false;
          this.isBadgeVisible = true;
        } else {
          this.isFlashing = true;
          // this.displayDigit = response.live?.twod!;
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
        //get the morning data
        this.serverTime = response.server_time!;
        this.eveningResult = response.result!;
        this.eveningTime = this.eveningResult[3].open_time!;

        //extract the hours, minutes and parse to string
        this.serverTimeString = this.extractTime(this.serverTime);

        this.compareServerTimeWithOpenTime(this.serverTimeString, this.eveningTime);

        if (!this.isServerBefore2pm && this.isEarly == false) {
          this.displayDigit = this.pm430digit;
          console.log('>>>>> EVENING WORKING <<<<<');
          this.isFlashing = false;
          this.isBadgeVisible = true;
        } else {
          this.isFlashing = true;
          console.log("evening disruptionnnnnnnnn")
          // this.displayDigit = response.live?.twod!;
        }
        //LOADING STOPS
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  compareServerTimeTo2PM( serverTime: string, twoPM: string ): void {
    // Extract hours from server time
    const serverHours = parseInt(serverTime.split(':')[0], 10);

    // Extract hours from open time
    const twoPmHours = parseInt(twoPM.split(':')[0], 10);

    // Compare hours
    if (serverHours > twoPmHours) {
      this.isServerBefore2pm = false;
    } else {
      this.isServerBefore2pm = true;
    }
  }

  // compareServerTimeTo5PM( serverTime: string, fivePM: string ): void {
  //   // Extract hours from server time
  //   const serverHours = parseInt(serverTime.split(':')[0], 10);

  //   // Extract hours from open time
  //   const twoPmHours = parseInt(fivePM.split(':')[0], 10);

  //   // Compare hours
  //   if (serverHours > twoPmHours) {
  //     this.isServerBefore2pm = false;
  //   } else {
  //     this.isServerBefore2pm = true;
  //   }
  // }

  compareServerTimeWithOpenTime(serverTime: string, openTime: string): void {
    // Extract hours, minutes, and seconds from server time
    const serverTimeParts = serverTime.split(':');
    const serverHours = parseInt(serverTimeParts[0], 10);
    const serverMinutes = parseInt(serverTimeParts[1], 10);

    // Extract hours, minutes, and seconds from open time
    const openTimeParts = openTime.split(':');
    const openHours = parseInt(openTimeParts[0], 10);
    const openMinutes = parseInt(openTimeParts[1], 10);

    // Compare hours
    if (serverHours > openHours) {
      this.isEarly = false;
      console.log("server time is later than open time");

    } else if (serverHours < openHours) {
      this.isEarly = true;
    } else {
      // If hours are equal, compare minutes
      if (serverMinutes > openMinutes) {
        this.isEarly = false;
        console.log("server time is later than open time");
      } else {
        this.isEarly = true;
      } 
    }
  }

  //extract time only from the server_time
  extractTime(serverTime: Date): string {
    // Convert the server time Date object to a string
    const serverTimeString = serverTime.toLocaleString();

    // Split the server time string by space to separate date and time parts
    const parts = serverTimeString.split(' ');

    // Get the time part (last part) from the split
    const timePart = parts[1];

    // Return the time part
    return timePart;
  }

  ngOnDestroy(): void {
    if (this.resultSub) {
      this.resultSub.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  //is weekday?
  isWeekday(): boolean {
    const today = new Date().getDay();
    return today >= 1 && today <= 5; // Monday to Friday
  }
}
