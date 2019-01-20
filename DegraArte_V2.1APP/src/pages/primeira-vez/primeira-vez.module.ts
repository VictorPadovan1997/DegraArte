import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrimeiraVezPage } from './primeira-vez';

@NgModule({
  declarations: [
    PrimeiraVezPage,
  ],
  imports: [
    IonicPageModule.forChild(PrimeiraVezPage),
  ],
  exports: [
    PrimeiraVezPage
  ]
})
export class PrimeiraVezPageModule {}
