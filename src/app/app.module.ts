import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { TotwelvehrPipe } from './services/totwelvehr.pipe';
import { History2dComponent } from './history2d/history2d.component';
import { Result3dComponent } from './result3d/result3d.component';
import { TimeParserPipe } from './pipe/time-parser.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaintenenceComponent } from './maintenence/maintenence.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TotwelvehrPipe,
    History2dComponent,
    Result3dComponent,
    TimeParserPipe,
    MaintenenceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSkeletonLoaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
