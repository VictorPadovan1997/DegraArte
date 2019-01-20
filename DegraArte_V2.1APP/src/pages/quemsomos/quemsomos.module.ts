import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuemsomosPage } from './quemsomos';

@NgModule({
  declarations: [
    QuemsomosPage,
  ],
  imports: [
    IonicPageModule.forChild(QuemsomosPage),
  ],
  exports: [
    QuemsomosPage
  ]
})
export class QuemsomosPageModule {}
