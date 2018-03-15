import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../primeng/primeng.module';
import { HttpClientModule } from '@angular/common/http';

// Page Components
import { SwaptrackerComponent } from './swaptracker.component';
import { PageHeaderComponent } from './page-header/page-header.component';

@NgModule({
  imports: [
    CommonModule,
    PrimeNgModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [ SwaptrackerComponent ],
  declarations: [SwaptrackerComponent, PageHeaderComponent]
})
export class SwaptrackerModule { }
