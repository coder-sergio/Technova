import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:3000',
})

// Tipos principales
export type Categoria = 'Laptop' | 'Tablet' | 'Accesorio' | 'Smartphone';

export interface Producto {
    id: number;
    nombre: string;
    marca: string;
    categoria: Categoria;
    precio: number;
    activo: boolean;
    
}

export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'user';
    activo: boolean;
    password: string;
}

export interface Pedido {
    id: number;
    usuarioId: number;
    productos: Array<{ productoId: number; cantidad: number }>;
    fecha: string;
    estado: 'pendiente' | 'procesado' | 'cancelado';
}

// CRUD de productos
export const getProductos = async () => api.get<Producto[]>('/productos');
export const addProducto = async (producto: Producto) => api.post('/productos', producto);
export const updateProducto = async (id: number, producto: Partial<Producto>) => api.put(`/productos/${id}`, producto);
export const deleteProducto = async (id: number) => api.delete(`/productos/${id}`);

// CRUD de usuarios y pedidos se pueden agregar igual