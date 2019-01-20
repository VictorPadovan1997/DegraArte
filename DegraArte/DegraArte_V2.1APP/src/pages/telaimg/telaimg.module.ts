import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TelaimgPage } from './telaimg';

@NgModule({
  declarations: [
    TelaimgPage,
  ],
  imports: [
    IonicPageModule.forChild(TelaimgPage),
  ],
  exports: [
    TelaimgPage,
  ]
})
export class TelaimgPageModule {}
