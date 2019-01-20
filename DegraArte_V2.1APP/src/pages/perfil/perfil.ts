import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UsuarioDatabaseProvider } from '../../providers/usuario-database/usuario-database';
import { FacebookLogin } from '../login/FacebookLogin';
import { FacebookLoginProvider } from '../../providers/facebook-login/facebook-login';
import { GoogleLoginProvider } from '../../providers/google-login/google-login';
import { SliderPage } from '../slider/slider';
import { UsuarioExternoProvider } from '../../providers/usuario-externo/usuario-externo';

/**
 * 
 * Pagina de Perfil
 * @author Zaqueu Pereira
 * email: zaqueu96@hotmail.com
 */
@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  private msg = 'Alterar Senha';
  private alterarsenha=false;
  private  usuario = {
    id:0,
    nome:'',
    email:'',
    img:'',
    telefone:'',
    senha:'',
    novasenha1:'',
    novasenha2:'',
    login:null,
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,public storage:Storage, 
    public usuariodatabase:UsuarioDatabaseProvider,public facebook:FacebookLoginProvider, 
    public databaseUSE:UsuarioExternoProvider,   public google:GoogleLoginProvider) {
  }

  ionViewDidLoad() {
      this.getUsuario();
      
  }

  private getUsuario(){
    this.storage.get('usuario').then(data1=>{
      this.storage.get('login').then(data2=>{
        if(data2 == 'facebook'){
          console.log('FACE -> '+JSON.stringify(data1));
          this.usuario.id = data1.id; 
          this.databaseUSE.getTelefone(this.usuario.id);
          this.storage.get('telefone').then(data=>{
            this.usuario.telefone = data;
            console.log('telefone=>'+data);
            console.log('telefone usuario=>'+this.usuario.telefone);
          });         
          this.usuario.nome = data1.name;
          this.usuario.email = data1.email;
          this.usuario.img = data1.picture.data.url;
          this.usuario.login = true;
        }else if(data2 == 'google'){
          console.log('GOOG -> '+JSON.stringify(data1));
          this.usuario.id = data1.userId;
          this.databaseUSE.getTelefone(this.usuario.id);
          this.storage.get('telefone').then(data=>{
            this.usuario.telefone = data;
            console.log('telefone=>'+data);
            console.log('telefone usuario=>'+this.usuario.telefone);
          });
          this.usuario.nome = data1.displayName;
          this.usuario.email = data1.email;
          this.usuario.img = 'https://lh3.googleusercontent.com/-VFau0ZviWus/AAAAAAAAAAI/AAAAAAAAAAA/v6eFtWPDjzo/s64-c/'+data1.id+'.jpg';
          this.usuario.login = true;
        }else{
          console.log('DEGRA -> '+JSON.stringify(data1));
          this.usuario.id = data1.usu_id;
          this.usuario.nome = data1.usu_nome;
          this.usuario.email = data1.usu_email;
          this.usuario.telefone = data1.usu_telefone;   
          this.usuario.login = false;  
          console.log('usuario=> '+this.usuario.id)
        }}).catch(e=>console.log('erro ao pegar usuario data2'))
    }).catch(e=>console.log('erro ao pegar usuario data1'));
  }

  // - Salvando Alterações
  salvarAlt(){
    console.log('usuario =>'+JSON.stringify(this.usuario));
    if(!this.usuario.login){
      if(this.alterarsenha){
        if(this.usuario.novasenha1 === this.usuario.novasenha2){
          this.usuario.senha = this.usuario.novasenha1;          
          this.usuariodatabase.atualizarUsuario(this.usuario,this.navCtrl);
        }else{
          this.usuariodatabase.showMsg('As Senhas Não Conferem!!',3000);
        }
      }else{
        this.usuariodatabase.atualizarUsuario(this.usuario,this.navCtrl);
      }
    }else{
      this.databaseUSE.AtualizarUsuario(this.usuario,this.navCtrl);
    }
  }


  // - botao alterar Senha
  AltSenha(){
    this.msg = (this.alterarsenha)? 'Alterar Senha':'Voltar ao Perfil';
    this.alterarsenha = !this.alterarsenha;
  }
  //  - validar Dicionario
  public valDic(obj:any):boolean{
    let ret = true;
    for(let key in obj){
      if(key == 'senha'|| key == 'novasenha1'|| key == 'novasenha2'){
          continue;
      }else if(obj[key] == '' ||obj[key]==null){
        ret = false;
        break;
      }
    }
    return ret;
  }
  // - realizando Logout
  logout(){
    this.storage.get('login').then(login=>{
      if(login == 'facebook'){
        this.storage.clear();
          this.facebook.DesconectarFacebook(this.navCtrl);
      }else if(login == 'google'){
        this.storage.clear();
        try{
          this.google.logout(this.navCtrl);
        }catch(exception){
          this.navCtrl.setRoot(SliderPage);
        }finally{
          console.log('erro no finaly');
          this.navCtrl.setRoot(SliderPage);
        }
        
      }else{        
        this.storage.set('usuario',null);
        this.navCtrl.setRoot(SliderPage);
      }
  });
}

}
