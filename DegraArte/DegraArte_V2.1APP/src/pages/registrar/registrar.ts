import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import{Storage} from '@ionic/storage'
import { UsuarioDatabaseProvider } from '../../providers/usuario-database/usuario-database';
import { UsuarioDegraProvider } from '../../providers/usuario-degra/usuario-degra';

/**
 * Pagina de Registrar Pessoa
 * @author Zaqueu Pereira
 *  zaqueu96@hotmail.com
 */
@IonicPage()
@Component({
  selector: 'page-registrar',
  templateUrl: 'registrar.html',
})
export class RegistrarPage {
  private erro = {
    msg:"",
    erro:false
  }
public  novoUsuario={
    nome:'',
    telefone:'',
    email:'',
    senha:'',
    senha2:''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public databaseUsu:UsuarioDegraProvider
    , public storage:Storage, public menuctrl:MenuController) {
  }

  ionViewDidLoad() {
    this.menuctrl.enable(false);
  }

  login(){
    this.navCtrl.pop();
  }


  registrar(){
    let chave  = true;
    for (let key in this.novoUsuario) {
       if(this.novoUsuario[key] == ''){
         chave = false;
         break;
       }     
    }
    if(!chave){
        this.databaseUsu.showMsg('Não é permitido Campos Vazios',3000);
    }else{
    if(this.novoUsuario.senha == this.novoUsuario.senha2){
        this.erro.erro=false;
        this.databaseUsu.registrarUsuario(this.novoUsuario,this.navCtrl);
    }else{
      this.erro.msg='Erro! As senhas não conferem! ';
      this.erro.erro = true;
    }}
  }

}
