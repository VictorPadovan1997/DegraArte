import { Component } from '@angular/core';
import{Storage} from '@ionic/storage';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FacebookLoginProvider } from '../../providers/facebook-login/facebook-login';
import { GoogleLoginProvider } from '../../providers/google-login/google-login';
import { RegistrarPage } from '../registrar/registrar';
import { UsuarioDegraProvider } from '../../providers/usuario-degra/usuario-degra';
import { RecuperarSenhaPage } from '../recuperar-senha/recuperar-senha';
import { HomePage } from '../home/home';
/**
 * Pagina de Login do Usuario do Degra Arte
 * @author Zaqueu Pereira de Sá
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private logado :boolean = false;
  private login={
    email:'',
    senha:''
  }
  private usuario:any ;
  constructor(public navCtrl: NavController, public navParams: NavParams,public facebook:FacebookLoginProvider,
   public google:GoogleLoginProvider,public databaseUsu:UsuarioDegraProvider,
     public storage:Storage,public menuctrl:MenuController) {
    }
  
    ionViewDidLoad() {
      this.menuctrl.enable(false);
 
}

// - metodo para realizar login Facebook
logarFace(){
  this.facebook.realizaLogin(this.navCtrl);
}

// - recuperar senha
recuperar(){
  this.navCtrl.push(RecuperarSenhaPage);
}
// - Metodo para realizar Login Degra
loginDegra(){
  this.databaseUsu.loginUsuario(this.login,this.navCtrl);
}

loginGoogle(){
 this.google.login(this.navCtrl);
}
// - Registrar Usuario
registrar(){
  this.navCtrl.push(RegistrarPage);
}

}
