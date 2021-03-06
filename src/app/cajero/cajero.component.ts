import { VentaTarjetaService } from './../_services/venta-tarjeta.service';
import { TarjetaService } from './../_services/tarjeta.service';
import { Tarjeta } from './../_model/tarjeta';
import { FacturaService } from './../_services/factura.service';
import { FacturaVentaService } from './../_services/factura-venta.service';
import { FacturaVenta } from './../_model/factura-venta';
import { TipoComprobante } from './../_model/tipo-comprobante';
import { TipoComprobanteService } from './../_services/tipo-comprobante.service';
import { Factura } from './../_model/factura';
import { TicketVenta } from './../_model/ticket-venta';
import { TicketVentaService } from './../_services/ticket-venta.service';
import { CajaVentaService } from './../_services/caja-venta.service';
import { CajaService } from './../_services/caja.service';
import { Caja } from './../_model/caja';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from './../_model/usuario';
import { CuentaUsuario } from './../_model/cuenta-usuario';
import { CuentaMenu } from './../_model/cuenta-menu';
import { Menu } from './../_model/menu';
import { CuentaMenuService } from './../_services/cuenta-menu.service';
import { UsuarioService } from './../_services/usuario.service';
import { CuentaUsuarioService } from './../_services/cuenta-usuario.service';
import { CuentaService } from './../_services/cuenta.service';
import { Message, ConfirmationService, SelectItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Cuenta } from '../_model/cuenta';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CajaVenta } from '../_model/caja-venta';
import { Venta } from '../_model/venta';
import { VentaService } from '../_services/venta.service';
import { MenuRecetaService } from '../_services/menu-receta.service';
import { RecetaProductoService } from '../_services/receta-producto.service';
import { ExistenciaService } from '../_services/existencia.service';
import { ConvertidorMedidasService } from '../_services/convertidor-medidas.service';
import { ActualizarExistencias } from '../_class/actualizar-existencias';
import { Ticket } from '../_model/ticket';
import { VentaTarjeta } from '../_model/venta-tarjeta';

@Component({
  selector: 'ac-cajero',
  templateUrl: './cajero.component.html',
  styleUrls: ['./cajero.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CajeroComponent implements OnInit {
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
  addCaja = false;
  addCuenta = false;
  addCobrarCuenta = false;
  cuentaUsuario: CuentaUsuario = new CuentaUsuario(null, null, null);
  usuario: Usuario = new Usuario(null, null, null);
  helper = new JwtHelperService();
  cantidad = 1;
  borrarCuenta = false;
  displayEdicionMenuCuenta = false;
  caja: Caja = null;
  pago = 0;
  cajaVenta: CajaVenta = new CajaVenta(null, null, null, null);
  venta: Venta = new Venta(null, null, null, null);
  comprobante = 'Ticket';
  comprobantes: SelectItem[];
  addVuelto = false;
  actualizarExistencia: ActualizarExistencias = new ActualizarExistencias();
  modalFactura = false;
  modalComprobante = false;
  modalCredito = false;
  modalComprobanteFinal = false;
  modalCobrarPorTarjeta = false;
  tarjeta: Tarjeta = new Tarjeta(null, null, null, null);
  tieneTarjeta = false;
  factura: Factura = new Factura(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  vuelto = 0;
  tipoComprobante: TipoComprobante;
  ventaComprobante: FacturaVenta = new FacturaVenta(null, null, null);
  constructor(
    private cuentaService: CuentaService,
    private cuentaUsuarioService: CuentaUsuarioService,
    private usuarioServicio: UsuarioService,
    private cuentaMenuService: CuentaMenuService,
    private confirmationService: ConfirmationService,
    private cajaService: CajaService,
    private cajaVentaService: CajaVentaService,
    private mensaje: MessageService,
    private ventaService: VentaService,
    private menuRecetaService: MenuRecetaService,
    private recetaProductoService: RecetaProductoService,
    private exitenciaService: ExistenciaService,
    private convertidorService: ConvertidorMedidasService,
    private ticketVentaService: TicketVentaService,
    private tipoComprobanteService: TipoComprobanteService,
    private facturaVentaService: FacturaVentaService,
    private facturaService: FacturaService,
    private tarjetaService: TarjetaService,
    private ventaTarjetaService: VentaTarjetaService
  ) {}

  ngOnInit() {
    this.comprobantes = [
      { label: 'Ticket', value: 'Ticket' },
      { label: 'Factura', value: 'Factura' },
      { label: 'Credito Fiscal', value: 'Credito' }
    ];
    const nick = this.helper.decodeToken(sessionStorage.getItem('token')).sub;
    this.usuarioServicio.getUsuarioByOneNick(nick).subscribe(user => {
      this.usuario = user;
      this.cajaService
        .getCajaByValores(this.usuario, moment().format('YYYY-MM-DD'))
        .subscribe(caja => {
          if (caja === null) {
            this.displayCaja();
          } else {
            this.caja = caja;
          }
        });
    });
  }

  menuServicio() {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
    this.cambioServicio = true;
    this.cambioCabana = false;
    this.cambioComida = false;
    this.cambioMenuPrincipal = false;
    this.cambioCategoriaMenu = false;
  }

  menuCabana() {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
    this.cambioServicio = false;
    this.cambioCabana = true;
    this.cambioComida = false;
    this.cambioMenuPrincipal = false;
    this.cambioCategoriaMenu = false;
  }
  menuComida(event) {
    if (this.caja === null) {
      this.displayCaja();
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
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
    this.cambioServicio = false;
    this.cambioCabana = false;
    this.cambioComida = false;
    this.cambioMenuPrincipal = true;
    this.cambioCategoriaMenu = false;
  }

  menuCategoriaMenu() {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
    this.cambioServicio = false;
    this.cambioCabana = false;
    this.cambioComida = false;
    this.cambioMenuPrincipal = false;
    this.cambioCategoriaMenu = true;
  }

  agregarMenu(event: Menu) {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
    this.cuentaMenu = new CuentaMenu(null, null, null, null);
    this.cuentaMenu.menu = new Menu(null, null, null, null, null, null);
    this.cuentaMenu.menu = event;
    this.cuentaMenu.cantidad = this.cantidad;
    if (this.cuenta === null) {
      this.agregarCuenta();
      console.log(this.cuenta);
      this.cuentaService.addCuenta(this.cuenta).subscribe(
        c => {
          this.cuenta = c;
          this.cuentaMenu.cuenta = this.cuenta;
          this.cuentaMenuService.addCuentaMenu(this.cuentaMenu).subscribe(
            r => {
              this.cuentaMenuService
                .getCuentaMenuByCuenta(this.cuenta)
                .subscribe(menus => {
                  this.menuCuenta = [];
                  this.menuCuenta = menus;
                });
            },
            error => {
              this.mensaje.add({
                severity: 'error',
                summary: 'Error agregando la cuenta',
                detail: 'Datos erroneos al querer agregar el menu'
              });
            }
          );
        },
        error => {
          this.mensaje.add({
            severity: 'error',
            summary: 'Error agregando la cuenta',
            detail: 'Datos erroneos al querer agregar el menu'
          });
        }
      );
    } else {
      this.cuentaMenu.cuenta = this.cuenta;
      this.cuentaMenuService.addCuentaMenu(this.cuentaMenu).subscribe(
        r => {
          this.cuentaMenuService
            .getCuentaMenuByCuenta(this.cuenta)
            .subscribe(menus => {
              this.menuCuenta = [];
              this.menuCuenta = menus;
            });
        },
        error => {
          this.mensaje.add({
            severity: 'error',
            summary: 'Error agregando la cuenta',
            detail: 'Datos erroneos al querer agregar el menu'
          });
        }
      );
    }

    this.total += this.cantidad * +this.cuentaMenu.menu.precio;
    this.cantidad = 1;
  }

  displayCuenta() {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
    this.menuCuenta = [];
    this.cuenta = new Cuenta(null, null, null, null, null, null, null);
    this.addCuenta = true;
  }

  displayCaja() {
    this.caja = new Caja(null, null, null, null, null, null, null);
    this.addCaja = true;
  }

  agregarCuenta() {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
    if (this.cuenta === null) {
      this.cuenta = new Cuenta(null, null, null, null, null, null, null);
      this.cuenta.mesa = 0;
      (this.cuenta.nombre = 'Caja'), (this.cuenta.cobrada = true);
      this.cuenta.cobrable = true;
      this.cuenta.fechaCuenta = moment().format('YYYY-MM-DD');
      this.cuenta.descuento = '0';
    }
  }
  agregarCaja() {
    this.addCaja = false;
    this.caja.aperturaCaja = moment().format('YYYY-MM-DD');
    this.caja.cierreCaja = moment().format('YYYY-MM-DD');
    this.caja.usuario = this.usuario;
    this.caja.cajaCerrada = false;

    this.cajaService.addCaja(this.caja).subscribe(caja => {
      this.caja = caja;
    });
  }
  cargarCuenta(event: Cuenta) {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
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

  displayBorrarCuenta() {
    if (this.cuenta === null) {
      this.displayCuenta();
      return;
    }
    this.confirmationService.confirm({
      message: 'Estas Seguro de eliminar la cuenta?',
      accept: () => {
        this.cuentaMenuService
          .deleteCuentaMenuByCuenta(this.cuenta)
          .subscribe(re => {
            this.cuentaUsuarioService
              .deleteCuentaUsuarioByCuenta(this.cuenta)
              .subscribe(re1 => {
                this.cuentaService.deleteCuenta(this.cuenta).subscribe(data => {
                  this.mensaje.add({
                    severity: 'info',
                    summary: 'Eliminado',
                    detail: 'Cuenta eliminada exitosamente'
                  });
                });
              });
          });
      }
    });
  }
  displayCuentaMenu(event: CuentaMenu) {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
    this.cuentaMenuEdicion = new CuentaMenu(null, null, null, null);
    this.cuentaMenuEdicion = event;
    this.displayEdicionMenuCuenta = true;
  }

  borrarCuentaMenu() {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
    this.displayEdicionMenuCuenta = false;
    this.total -=
      this.cuentaMenuEdicion.cantidad * +this.cuentaMenuEdicion.menu.precio;
    this.cuentaMenuService
      .deleteCuentaMenu(this.cuentaMenuEdicion)
      .subscribe(r => {
        this.cuentaMenuService
          .getCuentaMenuByCuenta(this.cuentaMenuEdicion.cuenta)
          .subscribe(cm => {
            this.menuCuenta = cm;
            this.total = 0;
            this.menuCuenta.forEach(lamda => {
              this.total += lamda.cantidad * +lamda.menu.precio;
            });
            this.cuentaMenuEdicion = null;
          });
      });
  }
  editarCuentaMenu() {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
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
  cobrarCuenta() {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
    this.addCobrarCuenta = false;
    if (this.cuenta === null) {
      this.agregarCuenta();
      this.cuentaService.addCuenta(this.cuenta).subscribe(cuenta => {
        this.cuenta = cuenta;

        const menusTempora: CuentaMenu[] = [];
        console.log(this.menuCuenta);
        this.menuCuenta.forEach(c => {
          c.cuenta = this.cuenta;
          menusTempora.push(c);
          this.actualizarExistencia.actualizarProducto(
            c,
            this.menuRecetaService,
            this.recetaProductoService,
            this.exitenciaService,
            this.convertidorService
          );
        });
        this.cuentaMenuService
          .addListCuentaMenu(menusTempora)
          .subscribe(resul => {
            this.venta = new Venta(
              null,
              null,
              moment().format('YYYY-MM-DD'),
              'Venta en caja'
            );
            this.ventaService.addVenta(this.venta).subscribe(venta => {
              this.venta = venta;
              this.cajaVenta.caja = this.caja;
              this.cajaVenta.cuenta = this.cuenta;
              this.cajaVenta.venta = this.venta;
              this.cajaVentaService
                .addCajaVenta(this.cajaVenta)
                .subscribe(res => {
                  this.cuenta = null;
                  this.vuelto = this.pago - this.total;
                  this.cobrar();

                  this.cuenta = null;
                  this.menuCuenta = [];
                  this.pago = 0;
                  this.total = 0;
                  this.mensaje.add({
                    severity: 'success',
                    summary: 'Proceso exitoso',
                    detail: 'Cuenta cobrada'
                  });
                });

              if (this.tieneTarjeta) {
                this.tarjetaService.addTarjeta(this.tarjeta).subscribe(t => {
                  this.ventaTarjetaService
                    .addVentaTarjeta(new VentaTarjeta(null, this.venta, t))
                    .subscribe(ventaTarjeta => {
                      // console.log(ventaTarjeta);
                      this.tieneTarjeta = false;
                    });
                });
              }
            });
          });
      });
    } else {
      this.cuenta.cobrable = true;
      this.cuenta.cobrada = true;
      this.cuentaService.updateCuenta(this.cuenta).subscribe(cuenta => {
        this.venta = new Venta(
          null,
          null,
          moment().format('YYYY-MM-DD'),
          'Venta por caja'
        );
        this.ventaService.addVenta(this.venta).subscribe(venta => {
          this.cuentaMenuService
            .getCuentaMenuByCuenta(this.cuenta)
            .subscribe(cs => {
              const CS = cs;
              console.log(CS);
              CS.forEach(c => {
                this.actualizarExistencia.actualizarProducto(
                  c,
                  this.menuRecetaService,
                  this.recetaProductoService,
                  this.exitenciaService,
                  this.convertidorService
                );
              });
            });
          this.venta = venta;
          this.cajaVenta.caja = this.caja;
          this.cajaVenta.cuenta = this.cuenta;
          this.cajaVenta.venta = this.venta;
          this.cajaVentaService.addCajaVenta(this.cajaVenta).subscribe(res => {
            this.vuelto = +this.total - +this.pago;
            this.cobrar();
            this.cuenta = null;
            this.menuCuenta = [];
            this.pago = 0;
            this.total = 0;
            this.mensaje.add({
              severity: 'success',
              summary: 'Proceso exitoso',
              detail: 'Cuenta cobrada'
            });
          });
          if (this.tieneTarjeta) {
            this.tarjetaService.addTarjeta(this.tarjeta).subscribe(t => {
              this.ventaTarjetaService
                .addVentaTarjeta(new VentaTarjeta(null, this.venta, t))
                .subscribe(ventaTarjeta => {
                  // console.log(ventaTarjeta);
                  this.tieneTarjeta = false;
                });
            });
          }
        });
      });
    }
  }
  limpiarCuenta() {
    this.cuenta = null;
    this.menuCuenta = [];
    this.total = 0;
  }
  displayCobrarCuentaTarjeta() {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }
    if (this.menuCuenta.length !== 0) {
      this.modalCobrarPorTarjeta = true;
    } else {
      this.mensaje.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error tiene que agregar producto'
      });
    }
  }
  displayCobrarCuenta() {
    if (this.caja === null) {
      this.displayCaja();
      return;
    }

    if (this.menuCuenta.length !== 0) {
      this.addCobrarCuenta = true;
    } else {
      this.mensaje.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error tiene que agregar producto'
      });
    }
  }

  cobrar() {
    switch (this.comprobante) {
      case 'Ticket':
        let ticket: TicketVenta = new TicketVenta(
          null,
          new Ticket(null, null),
          this.venta
        );
        this.ticketVentaService.addTicketVenta(ticket).subscribe(t => {
          ticket = t;
          this.confirmationService.confirm({
            message: `Vuelto es: $${this.vuelto}`,
            accept: () => {}
          });
        });
        break;
      case 'Factura':
        this.modalFactura = true;
        break;
      case 'Credito':
        this.modalFactura = true;
        break;
      default:
        break;
    }
  }
  cobrarFactura() {
    this.modalFactura = false;
    this.tipoComprobanteService
      .getComprobanteByComprobante('Factura')
      .subscribe(c => {
        this.tipoComprobante = c;
        this.factura.iva = 13;
        this.factura.tipoComprobante = this.tipoComprobante;
        this.facturaService.addFactura(this.factura).subscribe(f => {
          this.factura = f;
          const fv = new FacturaVenta(null, this.venta, this.factura);
          this.facturaVentaService.addFacturaVenta(fv).subscribe(res => {
            this.comprobante = 'Ticket';
            this.modalComprobanteFinal = true;
            /*this.factura = new Factura(
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
            );*/
          });
        });
      });
    // console.log(this.factura.correlativoFactura);
  }
  cobrarCredito() {
    this.modalFactura = false;
    this.tipoComprobanteService
      .getComprobanteByComprobante('Credito Fiscal')
      .subscribe(c => {
        this.tipoComprobante = c;
        this.factura.iva = 13;
        this.factura.tipoComprobante = this.tipoComprobante;
        this.facturaService.addFactura(this.factura).subscribe(f => {
          this.factura = f;
          const fv = new FacturaVenta(null, this.venta, this.factura);
          this.facturaVentaService.addFacturaVenta(fv).subscribe(res => {
            this.comprobante = 'Factura';
            this.modalComprobanteFinal = true;
            /*this.factura = new Factura(
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
            );*/

            /*  this.confirmationService.confirm({
              message: `Vuelto es: $${this.vuelto}`,
              accept: () => {}
            });*/
          });
        });
      });
    // console.log(this.factura.correlativoFactura);
  }
}
