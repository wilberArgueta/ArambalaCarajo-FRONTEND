import { Compra } from './compra';
import { Producto } from './producto';
export class CompraProducto {
  constructor(
    public idCompraProducto: string,
    public compras: Compra,
    public productos: Producto,
    public cantidad: number
  ) {}

  getIdCompraProducto() {
    return this.idCompraProducto;
  }

  setIdCompraProducto(idCompraProducto) {
    this.idCompraProducto = idCompraProducto;
  }

  getProductos(): Producto {
    return this.productos;
  }

  setProductos(productos: Producto) {
    this.productos = productos;
  }
  getCantidad(): number {
    return this.cantidad;
  }
  setCantidad(cantidad: number) {
    this.cantidad = cantidad;
  }

  getCompras(): Compra {
    return this.compras;
  }

  setCompras(compras: Compra) {
    this.compras = compras;
  }
}
