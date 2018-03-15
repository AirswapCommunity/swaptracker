import { NgModule } from '@angular/core';
import { CheckboxModule, ButtonModule, DataTableModule, DataListModule,
        DropdownModule, InputTextModule,
        InputTextareaModule, OverlayPanelModule, DialogModule,
        SpinnerModule, SidebarModule, SliderModule, SplitButtonModule, TooltipModule, 
        PanelModule } from 'primeng/primeng';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {TableModule} from 'primeng/table';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    ButtonModule,
    CheckboxModule,
    DataListModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    OverlayPanelModule,
    PanelModule,
    SidebarModule,
    SpinnerModule,
    SplitButtonModule,
    SliderModule,
    TableModule,
    ToggleButtonModule,
    TooltipModule,
  ],
  exports: [
    ButtonModule,
    CheckboxModule,
    DataListModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    OverlayPanelModule,
    PanelModule,
    SidebarModule,
    SplitButtonModule,
    SpinnerModule,
    SliderModule,
    TableModule,
    ToggleButtonModule,
    TooltipModule,
  ],
  declarations: []
})
export class PrimeNgModule { }
