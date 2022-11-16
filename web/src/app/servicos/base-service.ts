import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../seguranca/auth.service';
import { CustomHttp } from 'src/app/seguranca/custom-http';


@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {
  serviceURL = '';
  constructor(
    protected http: CustomHttp,
    protected auth: AuthService) {

  }

  excluir(id: Number): Promise<void> {
    const headers = new HttpHeaders();
    headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    this.auth.mostrarStatus = true;
    return this.http.delete(`${this.serviceURL}/${id}`, { headers: headers})
      .toPromise()
      .then(() => {
        this.auth.mostrarStatus = false;
        return null;
      }).catch(response => {
        this.auth.mostrarStatus = false;
        throw response;
      });
  }


  buscarPorId(id: number): Promise<T> {
    const headers = new HttpHeaders();
    headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    this.auth.mostrarStatus = true;
    return this.http.get<T>(`${this.serviceURL}/${id}`, { headers })
      .toPromise()
      .then(entidade => {
          this.auth.mostrarStatus = false;
          return entidade;
        }
      ).catch(response => {
        this.auth.mostrarStatus = false;
        throw response;
      });
  }

  adicionar(entidade: T): Promise<T> {
    const headers = new HttpHeaders();
    // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    headers.append('Content-Type', 'application/json');
    this.auth.mostrarStatus = true;
    return this.http.post<any>(this.serviceURL, entidade, { headers: headers})
      .toPromise()
      .then(response => {
        this.auth.mostrarStatus = false;
        return response;
      }
    ).catch(response => {
      this.auth.mostrarStatus = false;
      throw response;
    });
  }

  atualizar(entidade: any): Promise<T> {
    const headers = new HttpHeaders();
    headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    headers.append('Content-Type', 'application/json');
    this.auth.mostrarStatus = true;
    return this.http.put<any>(`${this.serviceURL}/${entidade.id}`,
      entidade, { headers: headers})
      .toPromise()
      .then(response => {
        this.auth.mostrarStatus = false;
        return response;
      }
    ).catch(response => {
      this.auth.mostrarStatus = false;
      throw response;
    });
  }

  listarTudo(): Promise<any> {
    const headers = new HttpHeaders();
    let params = new HttpParams();
    headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    this.auth.mostrarStatus = true;
    params = params.append('size', '9999');
    return this.http.get<any>(`${this.serviceURL}`, { headers: headers })
      .toPromise()
      .then(response => {
        this.auth.mostrarStatus = false;
        return response.content;
    }).catch(response => {
      this.auth.mostrarStatus = false;
      throw response;
    });
  }
}
