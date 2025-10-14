import { Menu } from 'primereact/menu';
import { useState } from 'react';
import Products from './Products';
import Users from './Users';

export default function Dashboard() {
    const [activeItem, setActiveItem] = useState('products');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.rol === 'admin';

    const menuItems = [
        { label: 'Products', icon: 'pi pi-shopping-bag', command: () => setActiveItem('products'), className: "mb-4" },
        ...(isAdmin ? [{ label: 'Users', icon: 'pi pi-users', command: () => setActiveItem('users'), className: "mb-4" }] : [])
    ];

    return (
        <div className="min-h-screen flex bg-gray-50">
            <aside className="w-64 bg-white shadow relative flex flex-col items-stretch py-8 px-2 z-10">

                <div className="mb-8 px-4">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Dashboard</h2>
                    <hr className="border-gray-300" />
                </div>
                <Menu model={menuItems}
                    className="border-none shadow-none"
                    style={{ background: 'transparent' }} />
                {user && user.email && (
                    <button
                        className="mt-8 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        onClick={() => {
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}
                    >
                        <i className="pi pi-sign-out mr-2" /> Log out
                    </button>
                )}

            </aside>
            <div className="w-px bg-gray-200 mx-0"></div>

            <main className="flex-1 flex flex-col p-8">
                <div className="bg-white rounded-lg shadow p-6">

                    {activeItem === 'products' ? <Products /> : (isAdmin ? <Users /> : null)}

                </div>

            </main>
        </div>
    )
}