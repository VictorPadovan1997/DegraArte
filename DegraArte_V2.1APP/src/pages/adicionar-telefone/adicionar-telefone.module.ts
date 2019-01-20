import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionarTelefonePage } from './adicionar-telefone';

@NgModule({
  declarations: [
    AdicionarTelefonePage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionarTelefonePage),
  ],
  exports: [
    AdicionarTelefonePage
  ]
})
export class AdicionarTelefonePageModule {}
