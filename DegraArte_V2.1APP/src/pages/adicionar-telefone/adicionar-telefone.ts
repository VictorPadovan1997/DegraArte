import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { UsuarioExternoProvider } from '../../providers/usuario-externo/usuario-externo';

/**
 * Pagina para o usuario adicionar o numero de celular
 */
@IonicPage()
@Component({
  selector: 'page-adicionar-telefone',
  templateUrl: 'adicionar-telefone.html',
})
export class AdicionarTelefonePage {
  private user={
    telefone:'',
    id:''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,public databaseUSE:UsuarioExternoProvider,
    public menuctrl:MenuController) {
  }

  ionViewDidLoad() {
    this.menuctrl.enable(false);
    this.user.id = this.navParams.get('user');
  }

  cadrastarnumero(){
    this.databaseUSE.inserirUsuario(this.user,this.navCtrl);
  }
}
