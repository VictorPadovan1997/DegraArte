import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Facebook,FacebookLoginResponse} from '@ionic-native/facebook';
import { Storage} from '@ionic/storage';
import { ToastController, NavController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { SliderPage } from '../../pages/slider/slider';
import { UsuarioExternoProvider } from '../usuario-externo/usuario-externo';
import { AdicionarTelefonePage } from '../../pages/adicionar-telefone/adicionar-telefone';

/*
// - Controle de Login do Facebook 
// - Zaqueu Pereira
*/
@Injectable()
export class FacebookLoginProvider {
  logado:boolean = false;
  usuario: any;
  private navCtrl:NavController = null;
  constructor(public facebook:Facebook,public storage:Storage, public toast:ToastController, public usedatabse:UsuarioExternoProvider){   
  }
  
  // Verificar Login
  private getLogin(){
       this.facebook.getLoginStatus()
      .then((res:FacebookLoginResponse) => {
        console.log(res.status);
        if(res.status === "connect") {
          this.logado = true;
        } else {
          this.logado = false;
        }
      })
      .catch(e => console.log(e));
   }
  
   // - Pega status de login
   public getStatus():boolean{
       this.getLogin();
       return this.logado;
   }
  
   //  - Realizar Login
   public realizaLogin(nav:NavController){
      this.facebook.login(['public_profile', 'email'])
      .then(res => {
        if(res.status === "connected") {
          this.logado = true;
          this.navCtrl = nav
          this.getFaceUsuario(res.authResponse.userID);
        } else {
          this.logado = false;
        }
      })
      .catch(e => this.showMsg('Erro ao Fazer Login...',3000));
   }
  
  // - Pegando detalhes do usuario
  private getFaceUsuario(id:any){
      this.facebook.api("/"+id+"/?fields=id,email,name,picture,gender",["public_profile"])
      .then(res => { 
        this.usuario = res;
        console.log('face'+ JSON.stringify(res));
        this.storage.set('login','facebook');
        this.storage.set('usuario',this.usuario); 
         this.storage.set('user',res.id); 
        this.usedatabse.verificarAcesso(res.id,this.navCtrl,AdicionarTelefonePage);
      })
      .catch(e => {
        this.msgErro();
      });
  }
  
  // - Desconectar Usuario
  public DesconectarFacebook(nav:NavController){
      this.facebook.logout()
      .then( res =>{ 
        this.logado = false;
        this.storage.clear();
        nav.setRoot(SliderPage);
      })
      .catch(e =>{
        console.log('erro-ao-logout-facebook =>'+JSON.stringify(e));
        this.msgErro()});
  }
  
  // - Pegar Usuario
  public getUsuarioFace(){
      return this.usuario;
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
