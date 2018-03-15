import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SwaptrackerModule } from './swaptracker/swaptracker.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SwaptrackerModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
