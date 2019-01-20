import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServRealizadoPage } from './serv-realizado';

@NgModule({
  declarations: [
    ServRealizadoPage,
  ],
  imports: [
    IonicPageModule.forChild(ServRealizadoPage),
  ],
  exports: [
    ServRealizadoPage
  ]
})
export class ServRealizadoPageModule {}
