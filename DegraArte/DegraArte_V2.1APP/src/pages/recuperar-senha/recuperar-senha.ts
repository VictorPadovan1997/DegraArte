import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { UsuarioDegraProvider } from '../../providers/usuario-degra/usuario-degra';

/**
 *
 * Pagina de Recuperçaõ de senha com base no email
 * 
 */
@IonicPage()
@Component({
  selector: 'page-recuperar-senha',
  templateUrl: 'recuperar-senha.html',
})
export class RecuperarSenhaPage {
  private user={
    email:''
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public databaseUser:UsuarioDegraProvider,
    public menuctrl:MenuController) {
    }
  
    ionViewDidLoad() {
      this.menuctrl.enable(false);
  }

  recuperarSenha(){
    this.databaseUser.recuperarUsuario(this.user.email,this.navCtrl);
  }
}
