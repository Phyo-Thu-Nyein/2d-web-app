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
  isLoading: boolean = false;

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
    console.log("live digit rn" + this.displayDigit)
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
        console.log("live digit before everything" + this.displayDigit)
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
