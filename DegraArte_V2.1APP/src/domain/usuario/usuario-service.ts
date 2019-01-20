import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Usuario } from './usuario';

const KEY = 'avatarUrl';

@Injectable()
export class UsuarioService {


    private _usuarioLogado: Usuario;

    constructor(private _http: Http){}

    private _getUri(email: string, senha: string){

        return `https://aluracar.herokuapp.com/login?email=${email}&senha=${senha}`;
    }

    login(email: string, senha: string) {
        let uri = this._getUri(email, senha);

        return this._http.get(uri)
            .map((res) =>  res.json().usuario)
            .toPromise()
            .then((usuario:Usuario) => {

                this._usuarioLogado = new Usuario(
                        usuario.id, 
                        usuario.nome, 
                        usuario.email, 
                        usuario.dataNascimento,
                    usuario.telefone);
            })
            .then(() => this._usuarioLogado);
    }

    obtemUsuarioLogado(){
        return this._usuarioLogado;
    }

    public guardaAvatar(url){
        localStorage.setItem(KEY, url);
    }

    obtemAvatar(){
        return localStorage.getItem(KEY);
    }

}

