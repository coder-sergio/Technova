// src/pages/Dashboard.tsx
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

type Role = 'admin' | 'user';

interface SessionUser {
  id: string | number;
  nombre?: string;
  name?: string;
  email: string;
  rol: Role;
  role?: Role;
  activo?: boolean;
  active?: boolean;
  password?: string;
}

interface User {
  id: number | string;
  nombre: string;
  email: string;
  rol: Role;
  activo: boolean;
  password: string;
}

interface Product {
  id: number | string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  activo: boolean;
}

interface OrderLine {
  productoId: number | string;
  cantidad: number;
}

interface Order {
  id: number | string;
  usuarioId: number | string;
  productos: OrderLine[];
  fecha: string; // YYYY-MM-DD
  estado: 'pendiente' | 'en_proceso' | 'enviado' | 'entregado' | 'cancelado';
}

/* -------------------- Helpers -------------------- */
const getCurrentUser = (): SessionUser | null => {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
};
const toNum = (v: any) => Number(v);

/* =========================================================
   DASHBOARD
   ========================================================= */
export default function Dashboard() {
  const me = getCurrentUser();
  const myRole: Role | undefined = (me?.role ?? me?.rol) as Role | undefined;
  const isAdmin = myRole === 'admin';
  if (!me) return <div className="p-8">No session.</div>;

  return isAdmin ? <AdminUsers me={me} /> : <UserOrders me={me} />;
}

/* =========================================================
   ADMIN VIEW: Users CRUD (excluding the logged admin)
   ========================================================= */
function AdminUsers({ me }: { me: SessionUser }) {
  const myId = useMemo(() => toNum(me.id), [me.id]);

  const [users, setUsers] = useState<User[]>([]);
  const [visible, setVisible] = useState(false);

  // inline edit
  const [editId, setEditId] = useState<number | string | null>(null);
  const [editData, setEditData] = useState<User | null>(null);

  const loadUsers = () =>
    api.get<User[]>('/usuarios').then((r) => {
      const list = r.data ?? [];
      // excluir al admin logeado
      setUsers(list.filter(u => toNum(u.id) !== myId));
    });

  useEffect(() => { loadUsers(); }, [myId]);

  // Add user form
  type Inputs = { nombre: string; email: string; rol: Role; password: string; };
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm<Inputs>();

  const onAdd = async (data: Inputs) => {
    try {
      const created = await api.post<User>('/usuarios', { ...data, activo: true });
      setUsers(prev => [...prev, created.data]);
      setVisible(false);
      reset();
      Swal.fire({ icon: 'success', title: 'User created' });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add user.' });
    }
  };

  const startEdit = (u: User) => { setEditId(u.id); setEditData({...u}); };
  const cancelEdit = () => { setEditId(null); setEditData(null); };
  const onEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editData) return;
    const { name, value, type, checked } = e.target as any;
    setEditData({ ...editData, [name]: type === 'checkbox' ? checked : value });
  };
  const saveEdit = async (id: number | string) => {
    if (!editData) return;
    try {
      // PUT reemplaza; enviamos todo el objeto editado
      await api.put(`/usuarios/${id}`, editData);
      await loadUsers();
      cancelEdit();
      Swal.fire({ icon: 'success', title: 'Saved' });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save.' });
    }
  };

  const remove = async (id: number | string) => {
    const res = await Swal.fire({
      title: 'Delete user?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });
    if (!res.isConfirmed) return;
    try {
      await api.delete(`/usuarios/${id}`);
      setUsers(prev => prev.filter(u => String(u.id) !== String(id)));
      Swal.fire({ icon: 'success', title: 'Deleted' });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete.' });
    }
  };

  const dialogFooter = (
    <div className="flex justify-end gap-2">
      <Button label="Cancel" className="p-button-text" onClick={() => { setVisible(false); reset(); }} disabled={isSubmitting} />
      <Button label={isSubmitting ? 'Adding...' : 'Add User'} type="submit" form="add-user-form" loading={isSubmitting} />
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <i className="pi pi-shield text-blue-600" /> Admin Panel — Users
        </h1>
        <Button label="Add User" icon="pi pi-plus" onClick={() => setVisible(true)} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full">
          <thead>
            <tr>
              {['ID', 'Name', 'Email', 'Role', 'Active', 'Actions'].map(h => <th key={h} className="text-left py-2 border-b">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={String(u.id)}>
                <td className="py-2 border-b">{u.id}</td>
                {editId === u.id && editData ? (
                  <>
                    <td className="py-2 border-b"><input name="nombre" value={editData.nombre} onChange={onEditChange} className="p-1 border rounded" /></td>
                    <td className="py-2 border-b"><input name="email" value={editData.email} onChange={onEditChange} className="p-1 border rounded" /></td>
                    <td className="py-2 border-b">
                      <select name="rol" value={editData.rol} onChange={onEditChange} className="p-1 border rounded">
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="py-2 border-b">
                      <input type="checkbox" name="activo" checked={editData.activo} onChange={onEditChange} />
                    </td>
                    <td className="py-2 border-b">
                      <button className="mr-2 text-green-600" onClick={() => saveEdit(u.id)}>Save</button>
                      <button className="text-gray-600" onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 border-b">{u.nombre}</td>
                    <td className="py-2 border-b">{u.email}</td>
                    <td className="py-2 border-b">{u.rol}</td>
                    <td className="py-2 border-b">{u.activo ? 'Yes' : 'No'}</td>
                    <td className="py-2 border-b">
                      <button className="mr-2 text-blue-600" onClick={() => startEdit(u)}>Edit</button>
                      <button className="text-red-600" onClick={() => remove(u.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add user modal */}
      <Dialog
        header={<span className="flex items-center gap-2"><i className="pi pi-user-plus text-blue-600" /> Add User</span>}
        visible={visible}
        style={{ width: 420 }}
        onHide={() => { setVisible(false); reset(); }}
        draggable={false}
        closable={!isSubmitting}
        footer={dialogFooter}
        modal
      >
        <form id="add-user-form" className="space-y-4 mt-2" onSubmit={handleSubmit(onAdd)} autoComplete="off">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <InputText {...register('nombre', { required: true })} className={`w-full${errors.nombre ? ' p-invalid' : ''}`} />
            {errors.nombre && <span className="text-red-500 text-xs">Name is required.</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <InputText {...register('email', { required: true })} className={`w-full${errors.email ? ' p-invalid' : ''}`} />
            {errors.email && <span className="text-red-500 text-xs">Email is required.</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role *</label>
            <select {...register('rol', { required: true })} className="w-full p-2 border rounded">
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            {errors.rol && <span className="text-red-500 text-xs">Role is required.</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <InputText type="password" {...register('password', { required: true })} className={`w-full${errors.password ? ' p-invalid' : ''}`} />
            {errors.password && <span className="text-red-500 text-xs">Password is required.</span>}
          </div>
        </form>
      </Dialog>
    </div>
  );
}

/* =========================================================
   USER VIEW: Order panel + My Orders
   ========================================================= */
function UserOrders({ me }: { me: SessionUser }) {
  const userId = toNum(me.id);

  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<number | ''>('');
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<{ product: Product; quantity: number; }[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const loadProducts = () =>
    api.get<Product[]>('/productos').then(r => setProducts((r.data ?? []).filter(p => p.activo)));

  const loadMyOrders = () =>
    api.get<Order[]>(`/pedidos?usuarioId=${userId}`).then(r => setOrders(r.data ?? []));

  useEffect(() => { loadProducts(); loadMyOrders(); }, [userId]);

  const addToCart = () => {
    if (!selected || qty <= 0) {
      Swal.fire({ icon: 'warning', title: 'Select a product', text: 'Choose a product and quantity.' });
      return;
    }
    const p = products.find(x => toNum(x.id) === selected);
    if (!p) return;
    setCart(prev => {
      const i = prev.findIndex(c => toNum(c.product.id) === toNum(p.id));
      if (i >= 0) {
        const cp = [...prev]; cp[i] = { ...cp[i], quantity: cp[i].quantity + qty }; return cp;
      }
      return [...prev, { product: p, quantity: qty }];
    });
    setSelected(''); setQty(1);
  };

  const updateQty = (pid: number | string, q: number) => {
    if (q <= 0) return setCart(prev => prev.filter(c => toNum(c.product.id) !== toNum(pid)));
    setCart(prev => prev.map(c => toNum(c.product.id) === toNum(pid) ? { ...c, quantity: q } : c));
  };

  const removeFromCart = (pid: number | string) =>
    setCart(prev => prev.filter(c => toNum(c.product.id) !== toNum(pid)));

  const placeOrder = async () => {
    if (cart.length === 0) return Swal.fire({ icon: 'info', title: 'Cart is empty' });
    const payload = {
      usuarioId: userId,
      productos: cart.map(c => ({ productoId: toNum(c.product.id), cantidad: c.quantity })),
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'pendiente' as const,
    };
    try {
      await api.post('/pedidos', payload);
      setCart([]);
      await loadMyOrders();
      Swal.fire({ icon: 'success', title: 'Order created' });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Could not create the order.' });
    }
  };

  const total = cart.reduce((acc, c) => acc + c.product.precio * c.quantity, 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <i className="pi pi-home text-blue-600" /> User Dashboard
      </h1>

      {/* Order panel */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <i className="pi pi-shopping-cart text-blue-600" /> Make an Order
        </h2>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            className="border rounded p-2"
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value) || '')}
          >
            <option value="">Select a product</option>
            {products.map(p => (
              <option key={String(p.id)} value={toNum(p.id)}>
                {p.nombre} — {p.marca} — ${p.precio}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            className="border rounded p-2 w-28"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />

          <Button label="Add to cart" icon="pi pi-plus" onClick={addToCart} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Product', 'Brand', 'Price', 'Quantity', 'Subtotal', 'Actions'].map(h => (
                  <th key={h} className="text-left py-2 border-b">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cart.map(ci => (
                <tr key={String(ci.product.id)}>
                  <td className="py-2 border-b">{ci.product.nombre}</td>
                  <td className="py-2 border-b">{ci.product.marca}</td>
                  <td className="py-2 border-b">${ci.product.precio}</td>
                  <td className="py-2 border-b">
                    <input
                      type="number"
                      min={1}
                      className="border rounded p-1 w-20"
                      value={ci.quantity}
                      onChange={(e) => updateQty(ci.product.id, Number(e.target.value))}
                    />
                  </td>
                  <td className="py-2 border-b">${ci.product.precio * ci.quantity}</td>
                  <td className="py-2 border-b">
                    <button className="text-red-600" onClick={() => removeFromCart(ci.product.id)}>Remove</button>
                  </td>
                </tr>
              ))}
              {cart.length === 0 && (
                <tr><td className="py-3 text-gray-500" colSpan={6}>Your cart is empty.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Total: ${total}</div>
          <Button label="Place Order" icon="pi pi-check" onClick={placeOrder} disabled={cart.length === 0} />
        </div>
      </div>

      {/* My orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <i className="pi pi-list text-blue-600" /> My Orders
        </h2>
        <table className="w-full">
          <thead>
            <tr>
              {['ID', 'Date', 'Status', 'Lines'].map(h => <th key={h} className="text-left py-2 border-b">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={String(o.id)}>
                <td className="py-2 border-b">{o.id}</td>
                <td className="py-2 border-b">{o.fecha}</td>
                <td className="py-2 border-b capitalize">{o.estado}</td>
                <td className="py-2 border-b">
                  {o.productos.map((l, i) => (
                    <span key={i} className="inline-block mr-2 bg-gray-100 px-2 py-0.5 rounded text-sm">
                      #{l.productoId} × {l.cantidad}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td className="py-3 text-gray-500" colSpan={4}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
