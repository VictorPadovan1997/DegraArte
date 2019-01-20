import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Constant } from '../../domain/constants';
import { SliderPage } from '../../pages/slider/slider';
import { HomePage } from '../../pages/home/home';
import { Md5 } from 'ts-md5/dist/md5';
import 'rxjs/add/operator/map';

/*
   - Manipular Login de Usuarios
*/
@Injectable()
export class UsuarioDegraProvider {
  private msgShow: any;
  private loader: any;
  constructor(public http: Http, public toast: ToastController, public load: LoadingController, public storage: Storage) { }

  // - Registrar Usuario

  public registrarUsuario(obj: any, navctrl: any) {
    let postdata = new FormData();
    postdata.append('nome', obj.nome);
    postdata.append('email', obj.email);
    postdata.append('senha', '' + Md5.hashStr(obj.senha));
    postdata.append('telefone', obj.telefone);
    this.showLoad('Registrando Conta...');
    this.http.post(Constant.API_USU + '/verificarEmail', postdata).map(resp => resp.json()).toPromise().then(data => {
      console.log(JSON.stringify(data));
      //this.showLoad('Registrando Conta...');
      if (data.n == 0) {
        this.http.post(Constant.API_USU + '/enserirUsuario', postdata).map(resp => resp.json()).toPromise().then(data => {
          if (data.n != 0) {
            this.storage.set('usuario', data.usuario[0]);
            this.showMsg('Registrado com Sucesso...', 4000);
            navctrl.setRoot(HomePage);
          } else {
            this.showMsg('Ocorreu um erro no seu cadrasto. Tente mas tarde.', 3000)
          }
        }).catch(e => this.msgErro());
      } else {
        this.showMsg('Esse email ja foi cadrastado!', 3000);
      }
    }).catch(e => this.msgErro());;
  }
  // - Atualizar Usuario
  public atualizarUsuario(obj: any, navctrl: any) {
    let postdata = new FormData();
    postdata.append('id', obj.id);
    postdata.append('nome', obj.nome);
    postdata.append('email', obj.email);
    postdata.append('senha', '' + Md5.hashStr(obj.senha));
    postdata.append('telefone', obj.telefone);
    this.showLoad('Atualizando Dados...')
    this.http.post(Constant.API_USU + '/validarAtualizacao', postdata).map(resp => resp.json()).toPromise().then(data => {
      if (data.n == 0) {
        this.http.post(Constant.API_USU + '/atualizarUsuario', postdata).map(resp => resp.json()).toPromise().then(data => {

          this.storage.set('usuario', data.usuario);
          this.showMsg('Registrado com Sucesso...', 4000);
          navctrl.setRoot(HomePage);
        }).catch(e => this.msgErro());
      } else {
        this.showMsg('Esse email ja foi cadrastado!', 3000);
      }
    }).catch(e => this.msgErro());
  }

  // - Atualizar Usuario Customizado
  public atualizarSenha(form: any, nav: any) {
    let load = this.load.create({ content: 'Atualizando...' });
    load.present();
    let post = new FormData();
    post.append('usu_senha', "" + Md5.hashStr(form.senha));
    post.append('usu_id', form.id);
    this.http.post(Constant.API_USU + '/atualizar', post).map(resp => resp.json()).toPromise().then(data => {
      if (data.n > 0) {
        load.dismiss();
        this.showMsg('Atualização Concluida', 3000);
      }
    }).catch(e => this.msgErro());
  }
  // - Deletar Usuario
  public removerUsuario(id: number, navCtrl: any) {
    let postdata = new FormData();
    postdata.append('id', '' + id);
    this.showLoad('Removendo Conta...');
    this.http.post(Constant.API_USU + '/removerUsuario', postdata).map(resp => resp.json()).toPromise().then(data => {
      if (data.n != 0) {
        this.showMsg('Usuario Removido', 3000);
        navCtrl.setRoot(SliderPage);
      } else {
        this.showMsg('Erro ao Remover Usuario!', 3000);
      }
    }).catch(e => this.msgErro());
  }

  // - Esqueceu Senha Usuario
  public recuperarUsuario(email: string, navCtrl: any): any {
    let postdata = new FormData();
    postdata.append('email', email);
    this.showLoad('Enviando Email...');
    return this.http.post(Constant.API_USU + '/recuperarSenha', postdata).map(resp => resp.json()).toPromise().then(data => {
      if (data.n != 0) {
        this.showMsg('Mensagem com Nova Senha Enviada ao Email.', 3000);
      } else {
        this.showMsg('Email não Encontrado.', 3000);
      }
    }).catch(e => {
      this.msgErro()
    });
  }

  //  - Realizar Login 
  public loginUsuario(obj: any, navctrl: any) {
    let post = new FormData();
    post.append('email', obj.email);
    post.append('senha', '' + Md5.hashStr(obj.senha));
    this.showLoad('Realizando Login...');
    this.http.post(Constant.API_USU + '/validarUsuario', post).map(resp => resp.json()).toPromise().then(data => {
      if (data.n != 0) {
        console.log(JSON.stringify(data.usuario[0]));
        this.hideLoad();
        this.storage.set('login', 'degraarte');
        this.storage.set('usuario', data.usuario[0]);
        this.storage.set('user', data.usuario[0].usu_id);
        navctrl.setRoot(HomePage);
      } else {
        this.showMsg('Email ou Senha invalido!', 4000);
      }
    }).catch(e => this.msgErro());
  }

  /**
   *    Metodos para Enserir Usuarios Externos
   *  
   */


  // Show mensagem Toast
  public showMsg(msg: string, d: number) {

    this.toast.create({
      message: msg,
      duration: d,
      position: 'bottom'
    }).present();
    this.hideLoad();
  }

  // - Mensagem de erro com o Servidor
  public msgErro() {
    this.showMsg('Erro na comunicação com o servidor!', 3000);
  }
  // - mostrar carregamento
  public showLoad(msg: string) {
    this.loader = false;
    this.msgShow = this.load.create({ content: msg });
    this.msgShow.present();

    //nn.dismissAll()

  }

  // - fechar tela de carregamento
  public hideLoad() {
    if (this.loader) {
      this.msgShow.dismissAll();
      this.msgShow.onWillDismiss(() => {
        this.loader = true;
      });
    }else{
        this.msgShow.dismissAll();
      }
    
  }
}
