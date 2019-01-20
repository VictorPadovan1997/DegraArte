import { Component, ViewChild} from '@angular/core';
import { IonicPage,NavParams, Nav } from 'ionic-angular';

/**
 *  Pagina para exibição dos serviços realizados 
 * 
 */
@IonicPage()
@Component({
  selector: 'page-serv-realizado',
  templateUrl: 'serv-realizado.html',
})
export class ServRealizadoPage  {
  @ViewChild('page-serv-realizado')nav:Nav;
  private lista = [];
  constructor(public navParams: NavParams) {
    
   // this.pegarLista();


  }

  
  

}
