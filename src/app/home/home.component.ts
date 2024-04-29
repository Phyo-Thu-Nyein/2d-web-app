import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/apiservice.service';
import { interval, of, Subscription } from 'rxjs';
import { switchMap, takeWhile, delayWhen } from 'rxjs/operators';
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
  isEarlierThanAM!: boolean;
  isEarlierThanPM!: boolean;

  //update the displayed Big two digit status
  isFlashing!: boolean;
  bigTwoDigits = document.getElementById('big-two-digits');
  //starts flashing again after 2pm/ 14hr
  onePm: string = '13:00:00';

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
  isServerBefore1pm?: boolean;

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
    this.callApiWeekdays();
  }

  //call the api on Mondays to friday
  callApiWeekdays() {
    // GET the live data every 6 seconds ONLY on Mondays to Fridays
    this.resultSub = interval(6000)
      .pipe(
        switchMap(() =>
          this.isWeekday() ? this.apiService.get2dResult() : of(null)
        ),
        delayWhen(() =>
          this.isEarlierThanPM
            ? interval(this.getMillisecondsUntil10AM())
            : of(null)
        ), // Delay until 10:00:00 if isEarlierThanPm is true
        takeWhile(() => this.isEarlierThanPM || this.isBefore10AM()) // Continue while isEarlierThanPm is true or before 10:00:00
      )
      .subscribe((response: TwoDigit | null) => {
        if (response) {
          this.data = response;
          this.result = this.data.result!;

          const index = this.calculateIndex();

          this.displayDigit = this.result[index].twod!;
          this.liveSet = this.result[index].set!;
          this.liveValue = this.result[index].value!;
          this.isFlashing = index === 0;
          this.isBadgeVisible = index !== 0;

          console.log('Api is called every 6 sec' + this.displayDigit);
        }
        this.isLoading = false;
      });
  }

  // Calculate index based on current time and server time
  calculateIndex() {
    if (this.isEarlierThanAM && this.isEarlierThanPM) {
      return 0; // Fetch live data
    } else if (!this.isEarlierThanAM && this.isServerBefore1pm) {
      return 1; // Fetch 12 pm data
    } else {
      return 3; // Fetch 4:30 pm data
    }
  }

  //THESE ARE USED TO START THE API CALL AUTOMATICALLY
  // Function to get the milliseconds until 10:00:00
  getMillisecondsUntil10AM() {
    const now = new Date();
    const tenAM = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      10,
      0,
      0
    );
    return tenAM.getTime() - now.getTime();
  }
  // Function to check if the current time is before 10:00:00
  isBefore10AM() {
    const currentTime = new Date().toLocaleTimeString([], { hour12: false }); // Get current time in HH:mm:ss format
    return currentTime < '10:00:00';
  }

  //timer subscription
  liveTime() {
    // Update currentDateTime every second
    this.timerSubscription = interval(1000) // 1 second
      .subscribe(() => {
        this.currentDateTime = new Date();
      });
  }

  //Get live results
  getLiveResult() {
    var result = this.apiService.get2dResult();
    this.resultSub = result.subscribe({
      next: (response: TwoDigit) => {
        this.displayDigit = response.live?.twod!;
        this.liveSet = response.live?.set!;
        this.liveValue = response.live?.value!;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
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

  // Common function to update session
  updateSession(sessionType: 'morning' | 'evening') {
    var result = this.apiService.get2dResult();
    this.resultSub = result.subscribe({
      next: (response: TwoDigit) => {
        // Get the server time and session result based on session type
        this.serverTime = response.server_time!;
        const sessionResult =
          sessionType === 'morning' ? response.result![1] : response.result![3];
        const sessionTime = sessionResult.open_time!;

        // Extract the hours and minutes and parse to string
        this.serverTimeString = this.extractTime(this.serverTime);

        // Compare server time with session time based on session type
        if (sessionType === 'morning') {
          this.compareServerTimeTo1PM(this.serverTimeString, this.onePm);
          this.compareServerTimeWithOpenTime(
            this.serverTimeString,
            sessionTime, 
            true //morning true
          );
        } else {
          this.compareServerTimeWithOpenTime(
            this.serverTimeString,
            sessionTime, 
            false //morning false
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  // Update morning session
  updateMorningSession() {
    this.updateSession('morning');
  }

  // Update evening session
  updateEveningSession() {
    this.updateSession('evening');
  }

  compareServerTimeTo1PM(serverTime: string, onePM: string): void {
    // Extract hours from server time
    const serverHours = parseInt(serverTime.split(':')[0], 10);

    // Extract hours from open time
    const onePmHours = parseInt(onePM.split(':')[0], 10);

    // Compare hours
    if (serverHours > onePmHours) {
      this.isServerBefore1pm = false;
    } else {
      this.isServerBefore1pm = true;
    }
  }

  compareServerTimeWithOpenTime(
    serverTime: string,
    openTime: string,
    isMorning: boolean
  ): void {
    // Extract hours, minutes, and seconds from server time
    const serverTimeParts = serverTime.split(':');
    const serverHours = parseInt(serverTimeParts[0], 10);
    const serverMinutes = parseInt(serverTimeParts[1], 10);

    // Extract hours, minutes, and seconds from open time
    const openTimeParts = openTime.split(':');
    const openHours = parseInt(openTimeParts[0], 10);
    const openMinutes = parseInt(openTimeParts[1], 10);

    // Compare hours
    let targetBoolean: boolean;

    if (serverHours > openHours) {
      targetBoolean = false;
    } else if (serverHours < openHours) {
      targetBoolean = true;
    } else {
      // If hours are equal, compare minutes
      if (serverMinutes > openMinutes) {
        targetBoolean = false;
      } else {
        targetBoolean = true;
      }
    }
    // Update the corresponding boolean variable
    if (isMorning) {
      this.isEarlierThanAM = targetBoolean;
    } else {
      this.isEarlierThanPM = targetBoolean;
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
