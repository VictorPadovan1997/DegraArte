import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController, ToastController } from 'ionic-angular';
import { Constant } from '../../domain/constants';
import { HomePage } from '../../pages/home/home';
import { Storage } from '@ionic/storage';
import { AdicionarTelefonePage } from '../../pages/adicionar-telefone/adicionar-telefone';
;

/*
  Pagina para o cliente que entrar pelo login do facebook ou google
*/
@Injectable()
export  class UsuarioExternoProvider {
  private msgShow:any;
  private loader:any;
  constructor(public http: Http,public toast:ToastController,public load:LoadingController,public storage:Storage) {
  }

  // metodo para inserir usuario externo
  public inserirUsuario(obj:any,nav:any){
    let post = new FormData();
    post.append('telefone',obj.telefone);
    post.append('user',obj.id);
    this.showLoad('Registrando Número...');
    this.http.post(Constant.API_USE+'/enserirUsuario',post).map(resp=>resp.json()).toPromise().then(data=>{
      if(data.n != 0){
        this.showMsg('Número Registrado...',3000);
        nav.setRoot(HomePage);
      }else{
        this.showMsg('Ocorreu um Erro ao Cadrasto o Número!',2000);
      }
    }).catch(e=>this.msgErro());
    
  }
  
  // - pegando telefone
  public getTelefone(id:any){
    let post = new FormData();
    let ret:string;
    post.append('id',id);
    this.showLoad('Verificando Dados...');
    this.http.post(Constant.API_USE+'/getTelefone',post).map(resp=>resp.json()).toPromise().then(data=>{
      console.log('gettel =>'+JSON.stringify(data.data[0].use_telefone));
      if(data.n != 0){
        this.hideLoad();
       this.storage.set('telefone',data.data[0].use_telefone);
       }else{
        this.hideLoad();
        this.showMsg('Verifique seu Número de telefone no Perfil',2000);
      }
    }).catch(e=>{
     console.log(JSON.stringify(e));
      this.msgErro();
    });
  }
  // metodo para verificar Acesso
  public verificarAcesso(user:any,nav:any,onde:any){
    let post  = new  FormData();
    post.append('usuario',''+user);
    this.storage.set('user',user);
    this.showLoad('Verificando Acesso...');
    this.http.post(Constant.API_USE+'/atualizarAcesso',post).map(resp=>resp.json()).toPromise().then(data=>{
      console.log('data-verifica =>'+JSON.stringify(data));
      if(data.n != 0){
        this.hideLoad();
        nav.setRoot(HomePage);
      }else{
        this.hideLoad();
      nav.setRoot(onde,{'user':user});
      }
    }).catch(e=>{
      console.log('AtualizarAcesso=> '+JSON.stringify(e,Object.getOwnPropertyNames(e)));  
      this.msgErro()
    });
  }
    // metodo para Atualizar Usuario Externo
    public AtualizarUsuario(obj:any,nav:any){
      let post = new FormData();
      post.append('telefone',obj.telefone);
      post.append('id',obj.id);
      this.showLoad('Atualizando Dados...');
      this.http.post(Constant.API_USE+'/atualizarTelefone',post).map(resp=>resp.json()).toPromise().then(data=>{
       
        if(data.n != 0){
          this.showMsg('Número Cadrastado.',3000);
          nav.setRoot(HomePage);
        }else{
          this.showMsg('Ocorreu um Erro ao Cadrasto o Número!',2000);
        }
      }).catch(e=>this.msgErro());
      
    }
  

     
  // Show mensagem Toast
  public showMsg(msg:string,d:number) {
    this.toast.create({
      message:msg,
      duration:d,
      position:'bottom'
    }).present();
    this.hideLoad();
  }

  // - Mensagem de erro com o Servidor
  public msgErro(){
    this.showMsg('Erro na comunicação com o servidor!',3000);    
  }
   // - mostrar carregamento
   public showLoad(msg:string){
     this.loader = false;
    this.msgShow = this.load.create({content:msg});
    this.msgShow.present();
   
    //nn.dismissAll()
   
 }

 // - fechar tela de carregamento
 public hideLoad(){
  this.msgShow.dismissAll();
   this.msgShow.onWillDismiss(()=>{
      this.loader = true;
     });
     if(this.loader){
     this.msgShow.dismissAll();
     }
 }
}
