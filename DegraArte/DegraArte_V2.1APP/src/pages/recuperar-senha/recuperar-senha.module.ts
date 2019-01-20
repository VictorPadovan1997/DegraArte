import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecuperarSenhaPage } from './recuperar-senha';

@NgModule({
  declarations: [
    RecuperarSenhaPage,
  ],
  imports: [
    IonicPageModule.forChild(RecuperarSenhaPage),
  ],
  exports: [
    RecuperarSenhaPage
  ]
})
export class RecuperarSenhaPageModule {}
