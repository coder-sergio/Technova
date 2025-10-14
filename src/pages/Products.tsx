import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Producto } from '../api';

export default function Products() {
    const [items, setItems] = useState<Producto[]>([]);
    const [filtro, setFiltro] = useState('');
    const [nuevo, setNuevo] = useState<Producto>({ id: 0, nombre: '', marca: '', categoria: 'Laptop', precio: 0, activo: true });
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Producto | null>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.rol === 'admin';
    const ColumnsName = ['ID', 'Nombre', 'Marca', 'Categoría', 'Precio', 'Activo', ...(isAdmin ? ['Acciones'] : [])];

    const cargar = () => {
        api.get('/productos').then(res => setItems(res.data));
    };
    useEffect(cargar, []);

    const handleFiltrar = (e: React.ChangeEvent<HTMLInputElement>) => setFiltro(e.target.value);

    const productosFiltrados = items.filter((p) =>
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        p.marca.toLowerCase().includes(filtro.toLowerCase()) ||
        p.categoria.toLowerCase().includes(filtro.toLowerCase())
    );

    const handleNuevo = (e: React.ChangeEvent<HTMLInputElement>) => setNuevo({ ...nuevo, [e.target.name]: e.target.value });
    const agregar = () => {
        api.post('/productos', { ...nuevo, precio: Number(nuevo.precio), activo: true }).then(cargar);
        setNuevo({ id: 0, nombre: '', marca: '', categoria: 'Laptop', precio: 0, activo: true });
    };

    const eliminar = (id: number) => {
        api.delete(`/productos/${id}`).then(cargar);
    };

    const activar = (p: Producto) => {
        api.put(`/productos/${p.id}`, { activo: !p.activo }).then(cargar);
    };

    const editar = (p: Producto) => {
        setEditId(p.id);
        setEditData({ ...p });
    };
    const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => editData && setEditData({ ...editData, [e.target.name]: e.target.value });
    const guardar = (id: number) => {
        if (editData) {
            api.put(`/productos/${id}`, { ...editData, precio: Number(editData.precio) }).then(() => {
                setEditId(null);
                setEditData(null);
                cargar();
            });
        }
    };
    const cancelar = () => {
        setEditId(null);
        setEditData(null);
    };

    return (
        <main className="flex-1 flex flex-col p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <i className="pi pi-shopping-bag text-blue-600" /> Products
            </h1>
            <input
                type="text"
                placeholder="Filtrar por nombre, marca o categoría"
                value={filtro}
                onChange={handleFiltrar}
                className="mb-4 p-2 border rounded"
            />
            {isAdmin && (
                <div className="mb-4 flex gap-2">
                    <input name="nombre" value={nuevo.nombre} onChange={handleNuevo} placeholder="Nombre" className="p-2 border rounded" />
                    <input name="marca" value={nuevo.marca} onChange={handleNuevo} placeholder="Marca" className="p-2 border rounded" />
                    <input name="categoria" value={nuevo.categoria} onChange={handleNuevo} placeholder="Categoría" className="p-2 border rounded" />
                    <input name="precio" value={nuevo.precio} onChange={handleNuevo} placeholder="Precio" className="p-2 border rounded" type="number" />
                    <button onClick={agregar} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                </div>
            )}
            <div className="bg-white rounded-lg shadow p-6">
                <table className="w-full">
                    <thead>
                        <tr>
                            {ColumnsName.map(col => <th key={col}>{col}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map(producto => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                {editId === producto.id && editData ? (
                                    isAdmin ? (
                                        <>
                                            <td><input name="nombre" value={editData.nombre} onChange={handleEdit} className="p-1 border rounded" /></td>
                                            <td><input name="marca" value={editData.marca} onChange={handleEdit} className="p-1 border rounded" /></td>
                                            <td><input name="categoria" value={editData.categoria} onChange={handleEdit} className="p-1 border rounded" /></td>
                                            <td><input name="precio" value={editData.precio} onChange={handleEdit} className="p-1 border rounded" type="number" /></td>
                                            <td>{editData.activo ? 'Sí' : 'No'}</td>
                                            <td>
                                                <button className="mr-2 text-green-600" onClick={() => guardar(producto.id)}>Save</button>
                                                <button className="text-gray-600" onClick={cancelar}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{producto.nombre}</td>
                                            <td>{producto.marca}</td>
                                            <td>{producto.categoria}</td>
                                            <td>${producto.precio}</td>
                                            <td>{producto.activo ? 'Sí' : 'No'}</td>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.marca}</td>
                                        <td>{producto.categoria}</td>
                                        <td>${producto.precio}</td>
                                        <td>{producto.activo ? 'Sí' : 'No'}</td>
                                        {isAdmin && (
                                            <td>
                                                <button className="mr-2 text-blue-600" onClick={() => editar(producto)}>Edit</button>
                                                <button className="mr-2 text-yellow-600" onClick={() => activar(producto)}>{producto.activo ? 'Desactivar' : 'Activar'}</button>
                                                <button className="text-red-600" onClick={() => eliminar(producto.id)}>Delete</button>
                                            </td>
                                        )}
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}