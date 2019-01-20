import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Carrinho } from '../../pages/agendamentos/carrinho';
import { ToastController, LoadingController } from 'ionic-angular';
import { Constant } from '../../domain/constants';
import { Storage } from '@ionic/storage';


/*
  Classe Responsavel pela busca  e inserção de dados
  @autor: Zaqueu Pereira
  @email: zaqueu96@hotmail.com
  @data: 12/10/2018
*/

@Injectable()
export class DatabaseProvider {
  private static chave = false;
  private usuario = {
    id: 0
  }
  private static carrinho: Array<Carrinho> = [];
  constructor(public http: Http, public toast: ToastController, public storage: Storage) {
    this.getUsuario();
  }

  // - Pegando Servico do banco de dados
  public getServico(): any {
    return this.http.get(Constant.API + 'foods_api/pegarServico').map(resp => resp.json()).toPromise().catch(
      e => {
        this.showMsg('Erro ao Carregar Serviços!', 4000)
      }
    );
  }

  //  -  Pegando Serviços realizados
  public getServRealizado(): any {
    return this.http.get(Constant.API + 'categories_api/Servicos').map(resp => resp.json()).toPromise().catch(
      e => {
        this.showMsg('Erro Servidor Indisponível!', 4000)
      });
  }

  // - pegando Profissionais do banco de dados
  public getProfessioanl() {
    return this.http.get(Constant.API + 'professional_api/pegarProfissional').map(resp => resp.json()).toPromise()
      .catch(
        e => {
          this.showMsg('Erro Servidor Indisponível!', 4000)
        });;

  }

  // - Verificando Agenda
  public validaAgenda(dados: any): any {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = new RequestOptions({ headers: headers });
    let post = new FormData();
    post.append("pro_id", dados.txtprof)
    post.append("data", dados.txtdata);
    post.append("hora", dados.txthorario);
    return this.http.post(Constant.API + 'agendamento_api/verificarAgenda', post).map(resp => resp.json()).toPromise().catch(
      e => {
        this.showMsg('Erro Servidor Indisponível!', 4000)
      });;



  }
  /// Adicionando itens no Carrinho
  public static doAdicionar(obj: any, qte: number) {
    let car = new Carrinho();
    car.data = obj;
    car.qte = qte;
    let n = this.doExistsCar(obj);
    if (n > 0) {
      this.carrinho[n].qte += 1;
    } else {
      this.carrinho.push(car);
    }

  }
  public static doRemover(obj: any) {
    this.carrinho.forEach((item, index) => {
      if (item.data.ser_nome === obj.data.ser_nome && item.qte === obj.qte)
        this.carrinho.splice(index, 1);
    });
  }
  // Pegando Lista
  public static getListaCarrinho(): any {
    return this.carrinho;
  }

  // - Função para tirar duplicidade de dados
  private static doExistsCar(obj: any): number {
    let ret = 0;
    if (this.carrinho.length == 0) {
      console.log('Array Zerado')
      return ret;
    }
    for (let a = 0; a < this.carrinho.length; a++) {
      if (this.carrinho[a].data.ser_nome === obj.ser_nome) {
        ret = a
      }
    }
    return ret;
  }

  // - pegar chave
  public static getChave() {
    return this.chave;
  }

  // - Alterar Chave
  public static setChave(key: boolean) {
    this.chave = key;
  }
  // - Alterando Carrinho
  public static doZerarCar() {
    this.carrinho = [];
  }

  // - Enserir Agenda e Lista
  public inserirAgendamento(agenda: any, obj: any, lista: any, load: LoadingController) {
    let post = new FormData();
    let loader = load.create({ content: 'Agendando Horário...' });
    loader.present();
    console.log('obj=>' + JSON.stringify(obj));
    post.append('id', obj.id);
    post.append("pro_id", agenda.txtprof)
    post.append("data", agenda.txtdata);
    post.append("hora", agenda.txthorario);
    post.append('nome', obj.nome);
    post.append('lista', JSON.stringify(lista));
    post.append('fone', obj.telefone);
    post.append('fatura', agenda.txtfatura);
    post.append('forma', (DatabaseProvider.getChave()) ? 'via PayPal' : 'Pagar em Mãos')
    this.http.post(Constant.API + 'agendamento_api/inserirAgenda', post).map(resp => resp.json()).toPromise()
      .then(data => {
        loader.dismissAll();
        if (data.n > 0) {
          this.showMsg('Horário Agendado', 3000);
        } else {
          this.showMsg('Ocorreu um erro ao Inserir', 3000);
        }


      }).catch(e => {
        console.log('erro enserir agendamento=> ' + JSON.stringify(e, Object.getOwnPropertyNames(e)));
        loader.dismissAll();
        this.showMsg('Horário Agendado com Sucesso', 4000);
        //this.navCtrl.setRoot(HomePage);
      });
  }

  // - Pegando Usuario
  private getUsuario() {
    this.storage.get('usuario').then(data1 => {
      this.storage.get('login').then(data2 => {
        if (data2 == 'facebook') {
          console.log('meuAge =>' + JSON.stringify(data1))
          this.usuario.id = data1.id;
        } else if (data2 == 'google') {
          console.log('meuAge =>' + JSON.stringify(data1))
          try {
            this.usuario.id = data1.userId;
          } catch (exception) {}
        } else {
          console.log('meuAge =>' + JSON.stringify(data1))
          this.usuario.id = data1.usu_id;
        }
      }).catch(e => console.log('erro ao pegar usuario'))
    }).catch(e => console.log('erro ao pegar usuario'));
  }
  // - Carregando Agendamentos do Usuario
  public meusAgendamentos(): any {
    this.getUsuario();
    let post = new FormData();
    return this.storage.get('user').then((data: any) => {
      this.usuario.id = data;
      console.log('data-user => ' + data);
      console.log('meusAgendamentos => ' + JSON.stringify(this.usuario));
      post.append('id', '' + data);
      return this.http.post(Constant.API + 'agendamento_api/pegarAgendamento', post).map(resp => resp.json()).toPromise().catch(
        e => {
          this.showMsg('Erro Servidor Indisponível!', 2000)
        });
    });

  }

  // -  remover Agendamento
  public removerAgendamento(id: any) {
    let post = new FormData();
    post.append('id', id);
    this.http.post(Constant.API + 'agendamento_api/removerAgendamento', post).map(resp => resp.json()).toPromise().then(() => {
      this.showMsg('Agendamento Cancelado...', 3000);
    }).catch(
      e => {
        this.showMsg('Erro Servidor Indisponível!', 2000)
      });;
  }
  // -  Caixa de Exibição
  public showMsg(msg: string, duracao: number) {
    this.toast.create({ message: msg, duration: duracao, position: 'botton' }).present();
  }
  // - Mensagem de erro com o Servidor
  public msgErro() {
    this.showMsg('Erro na comunicação com o servidor!', 3000);
  }
}


