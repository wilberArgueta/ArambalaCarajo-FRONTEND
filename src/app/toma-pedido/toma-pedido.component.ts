import { CuentaMenuService } from './../_services/cuenta-menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioService } from './../_services/usuario.service';
import { Usuario } from './../_model/usuario';
import { CuentaUsuario } from './../_model/cuenta-usuario';
import { CuentaUsuarioService } from './../_services/cuenta-usuario.service';
import { CuentaService } from './../_services/cuenta.service';
import { Menu } from './../_model/menu';
import { CuentaMenu } from './../_model/cuenta-menu';
import { Component, OnInit } from '@angular/core';
import { Cuenta } from '../_model/cuenta';
import * as moment from 'moment';
import { ConfirmationService, Message } from 'primeng/api';

@Component({
  selector: 'ac-toma-pedido',
  templateUrl: './toma-pedido.component.html',
  styleUrls: ['./toma-pedido.component.scss'],
  providers: [ConfirmationService]
})
export class TomaPedidoComponent implements OnInit {
  cambioServicio = false;
  cambioCabana = false;
  cambioComida = false;
  cambioCategoriaMenu = false;
  cambioMenuPrincipal = true;
  menus: Menu[] = [];
  menuCuenta: CuentaMenu[] = [];
  cuentaMenu: CuentaMenu = new CuentaMenu(null, null, null, null);
  cuentaMenuEdicion: CuentaMenu = null;
  idCategoriaMenu: number;
  cuenta: Cuenta = null;
  total = 0;
  cargaLista = false;
  addCuenta = false;
  cuentaUsuario: CuentaUsuario = new CuentaUsuario(null, null, null);
  usuario: Usuario = new Usuario(null, null, null);
  helper = new JwtHelperService();
  cantidad = 1;
  borrarCuenta = false;
  displayEdicionMenuCuenta = false;
  msgs: Message[];

  constructor(
    private cuentaService: CuentaService,
    private cuentaUsuarioService: CuentaUsuarioService,
    private usuarioServicio: UsuarioService,
    private cuentaMenuService: CuentaMenuService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    const nick = this.helper.decodeToken(sessionStorage.getItem('token')).sub;
    this.usuarioServicio.getUsuarioByOneNick(nick).subscribe(user => {
      this.usuario = user;
    });

    if (this.cuenta === null) {
      this.displayCuenta();
      return;
    }
  }

  menuServicio() {
    if (this.cuenta === null) {
      this.displayCuenta();
      return;
    }
    this.cambioServicio = true;
    this.cambioCabana = false;
    this.cambioComida = false;
    this.cambioMenuPrincipal = false;
    this.cambioCategoriaMenu = false;
  }

  menuCabana() {
    if (this.cuenta === null) {
      this.displayCuenta();
      return;
    }
    this.cambioServicio = false;
    this.cambioCabana = true;
    this.cambioComida = false;
    this.cambioMenuPrincipal = false;
    this.cambioCategoriaMenu = false;
  }
  menuComida(event) {
    if (this.cuenta === null) {
      this.displayCuenta();
      return;
    }
    this.idCategoriaMenu = event;
    this.cambioServicio = false;
    this.cambioCabana = false;
    this.cambioComida = true;
    this.cambioMenuPrincipal = false;
    this.cambioCategoriaMenu = false;
  }
  menuPrincipal() {
    if (this.cuenta === null) {
      this.displayCuenta();
      return;
    }
    this.cambioServicio = false;
    this.cambioCabana = false;
    this.cambioComida = false;
    this.cambioMenuPrincipal = true;
    this.cambioCategoriaMenu = false;
  }

  menuCategoriaMenu() {
    if (this.cuenta === null) {
      this.displayCuenta();
      return;
    }
    this.cambioServicio = false;
    this.cambioCabana = false;
    this.cambioComida = false;
    this.cambioMenuPrincipal = false;
    this.cambioCategoriaMenu = true;
  }

  agregarMenu(event: Menu) {
    if (this.cuenta === null) {
      this.displayCuenta();
      return;
    }
    this.cuentaMenu.cantidad = this.cantidad;
    this.cuentaMenu.cuenta = this.cuenta;
    this.cuentaMenu.menu = event;
    this.total += this.cantidad * +this.cuentaMenu.menu.precio;
    this.cuentaMenuService.addCuentaMenu(this.cuentaMenu).subscribe(cm => {
      this.cuentaMenuService
        .getCuentaMenuByCuenta(this.cuenta)
        .subscribe(dd => {
          this.menuCuenta = dd;
          this.total = 0;
          this.menuCuenta.forEach(lamda => {
            this.total += lamda.cantidad * +lamda.menu.precio;
          });
        });
    });

    this.cantidad = 1;
  }
  displayCuenta() {
    this.menuCuenta = [];
    this.cuenta = new Cuenta(null, null, null, null, null, null, null);
    this.addCuenta = true;
  }

  agregarCuenta() {
    this.cuenta.cobrada = false;
    this.cuenta.cobrada = false;
    this.cuenta.fechaCuenta = moment().format('YYYY-MM-DD');
    this.cuenta.descuento = '0';
    this.addCuenta = false;

    this.cuentaService.addCuenta(this.cuenta).subscribe(cuenta => {
      this.cuenta = cuenta;
      this.cuentaUsuario = new CuentaUsuario(null, null, null);
      this.cuentaUsuario.cuenta = this.cuenta;
      this.cuentaUsuario.usuario = this.usuario;
      this.cuentaUsuarioService
        .addCuentaUsuario(this.cuentaUsuario)
        .subscribe(cu => {
          this.cuentaUsuario = cu;
        });
    });
  }

  cargarCuenta(event: Cuenta) {
    this.cuenta = event;
    this.cuentaUsuarioService
      .getCuentaUsuarioByCuenta(this.cuenta)
      .subscribe(cu => {
        this.cuentaUsuario = cu;
        this.cuentaMenuService
          .getCuentaMenuByCuenta(this.cuenta)
          .subscribe(cm => {
            this.menuCuenta = cm;
            this.total = 0;
            this.menuCuenta.forEach(lamda => {
              this.total += lamda.cantidad * +lamda.menu.precio;
            });
          });
      });
  }


  displayCuentaMenu(event: CuentaMenu) {
    this.cuentaMenuEdicion = new CuentaMenu(null, null, null, null);
    this.cuentaMenuEdicion = event;
    this.displayEdicionMenuCuenta = true;
  }

  editarCuentaMenu() {
    this.displayEdicionMenuCuenta = false;
    this.total -=
      this.cuentaMenuEdicion.cantidad * +this.cuentaMenuEdicion.menu.precio;

    this.cuentaMenuService
      .updateCuentaMenu(this.cuentaMenuEdicion)
      .subscribe(we => {
        this.cuentaMenuService
          .getCuentaMenuByCuenta(this.cuentaMenuEdicion.cuenta)
          .subscribe(cm => {
            this.total = 0;
            this.menuCuenta.forEach(lamda => {
              this.total += lamda.cantidad * +lamda.menu.precio;
            });
            this.cuentaMenuEdicion = null;

          });
      });
  }
}
