
import { IonicPage, NavParams, Nav, ToastController, NavController } from 'ionic-angular';
import { Component, ViewChild,} from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

/**
 * 
 */
@IonicPage()
@Component({
  selector: 'page-telaimg',
  templateUrl: 'telaimg.html',
})
export class TelaimgPage {
  @ViewChild('page-telaimg')nav:Nav;
  private lista = []
  private url='http://degraartesistemamobile.online/'
  private chave = false;
constructor( public navParams: NavParams, public http:Http,public toast:ToastController,public navctrl:NavController,public storage:Storage) {
    }
  ionViewWillEnter(){
    console.log(this.navParams.get('chave'))
    if(this.navParams.get('chave') == true){      
    console.log('Entrou!');
      this.chave = !this.chave;
      let database = new DatabaseProvider(this.http,this.toast,this.storage);
      database.getServRealizado().then((data)=>{
        this.lista = data;
      }).catch(()=>{database.showMsg('Erro ao Carregar Serviços',4000)})
    }
  }


}
