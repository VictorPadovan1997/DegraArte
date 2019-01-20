import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { GooglePlus } from '@ionic-native/google-plus';
import { ToastController, LoadingController, NavController } from 'ionic-angular';
import { SliderPage } from '../../pages/slider/slider';
import { HomePage } from '../../pages/home/home';
import { UsuarioExternoProvider } from '../usuario-externo/usuario-externo';
import { AdicionarTelefonePage } from '../../pages/adicionar-telefone/adicionar-telefone';
/*
   * Provide responsavel pelo login de usuario no Google
*/
@Injectable()
export class GoogleLoginProvider {

  constructor(public storage:Storage,public toast:ToastController,public google:GooglePlus,public loading:LoadingController,
    public databaseUse:UsuarioExternoProvider) {
  }

  // - metodo para realizar login Google
  public login(nav:NavController){
    let load  = this.loading.create({
      content:'Conectando ao Google....',
      });
      load.present();
  this.google.login({})
  .then(res => {
    this.storage.set('login','google');
    this.storage.set('user',res.userId);
    this.storage.set('usuario',res);
    load.dismiss();
   // nav.setRoot(HomePage);
   this.databaseUse.verificarAcesso(res.userId,nav,AdicionarTelefonePage);
    console.log('google'+JSON.stringify(res))
  })  .catch(err => {
    load.dismiss();
    this.msgErro()
  });
  }

  // metodo para desconectar 
  
  public logout(nav:NavController){
    let load  = this.loading.create({
      content:'Desconectando....'
      });
      load.present();
    this.google.logout().then(()=>{
      load.dismiss();
      this.showMsg('Google desconectado',3000);
      nav.setRoot(SliderPage);
    }).catch(e=>{
      load.dismiss();
      console.log('erro-ao-logout-google =>'+JSON.stringify(e));
      this.msgErro();
    });
  }
   // Show mensagem Toast
   public showMsg(msg:string,d:number) {
    this.toast.create({
      message:msg,
      duration:d,
      position:'bottom'
    }).present();
  }
 
  // - Mensagem de erro com o Servidor
  public msgErro(){
    this.showMsg('Erro na comunicação com o servidor!',3000);
  }
}
