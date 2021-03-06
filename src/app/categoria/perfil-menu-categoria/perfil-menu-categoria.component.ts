import { CategoriaMenu } from './../../_model/categoria-menu';
import { ConfirmationService, Message } from 'primeng/api';
import { CategoriaMenuService } from './../../_services/categoria-menu.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ac-perfil-menu-categoria',
  templateUrl: './perfil-menu-categoria.component.html',
  styleUrls: ['./perfil-menu-categoria.component.scss'],
  providers: [ConfirmationService]
})
export class PerfilMenuCategoriaComponent implements OnInit {


  constructor(
    private rout: ActivatedRoute,
    private router: Router,
    private servicio: CategoriaMenuService,
    private confirmation: ConfirmationService
  ) {}

  es: any;

  idCategoria: number;
  disable = true;
  msgs: Message[] = [];
  tipoPerfil = false;
  menu = new CategoriaMenu(null, '');
  options: any[] = [{label: 'Si', icon: 'pi pi-check', value: true},
  {label: 'No', icon: 'pi pi-times', value: false}];

  ngOnInit() {
    this.rout.params.subscribe((params: Params) => {
      if (params['id'] === 'nuevo') {
        this.menu =  new CategoriaMenu(null, '');
        this.tipoPerfil = false;
        this.disable = false;
      } else {
        this.tipoPerfil = true;
        this.idCategoria = params['id'];
        this.servicio.getCategoriaById(this.idCategoria).subscribe(data => {
          this.menu = data;
        });
      }
    });
  }

  regresar($event) {
    this.router.navigate(['/categorias'], { relativeTo: this.rout });
  }
  save($event) {
    if (this.tipoPerfil) {
      // Editando Una categoria existente
      // console.log(this.empleado);
      this.servicio.updateCategoria(this.menu).subscribe(data => {
        this.menu = data;
        this.msgs = [
          {
            severity: 'info',
            summary: 'Confirmado',
            detail: 'Categoria Actualizada...'
          }
        ];
      });
    } else {
     // Guardando una nueva categoria
      this.servicio.addCategoria(this.menu).subscribe(data => {
        this.menu = data;
        this.msgs = [
          {
            severity: 'info',
            summary: 'Confirmado',
            detail: 'Categoria Agregada Correctamente'
          }
        ];
      });
    }
    this.tipoPerfil = true;
    this.disable = true;
  }
  cancel($event) {
    if (this.tipoPerfil) {
      this.disable = true;
    } else {
      this.router.navigate(['/categorias'], { relativeTo: this.rout });
    }
  }
  update($event) {
    this.disable = false;
  }
  confirm($event) {
    this.confirmation.confirm({
      message: 'Estas seguro que quieres eliminar?',
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delete();
      }
    });
  }
  confirm2($event) {
    this.confirmation.confirm({
      message: 'Estas seguro que quieres cambiar los datos?',
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.save(event);
      }
    });
  }
  delete() {
    this.servicio.deleteCategoria(this.menu).subscribe(data => {
      this.msgs = [
        {
          severity: 'info',
          summary: 'Confirmado',
          detail: data.message
        }
      ];
    });
    setTimeout(() => {
      this.router.navigate(['/categorias'], { relativeTo: this.rout });
    }, 1500);
    console.log('Eliminado');
  }

}
