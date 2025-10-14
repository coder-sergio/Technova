import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import type { Request, Response } from 'express';

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Tipos
interface Producto {
  id: number;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  activo: boolean;
}
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  password: string;
}
interface Pedido {
  id: number;
  usuarioId: number;
  productos: Array<{ productoId: number; cantidad: number }>;
  fecha: string;
  estado: string;
}
interface DB {
  productos: Producto[];
  usuarios: Usuario[];
  pedidos: Pedido[];
}

function readDB(): DB {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}
function writeDB(data: DB) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// LOGIN
app.get('/usuarios', (req: Request, res: Response) => {
  const { email, password } = req.query;
  const db = readDB();
  let result = db.usuarios;
  if (email && password) {
    result = result.filter(u => u.email === email && u.password === password);
  }
  res.json(result);
});

// CRUD USUARIOS
app.get('/usuarios/all', (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.usuarios);
});
app.post('/usuarios', (req: Request, res: Response) => {
  const db = readDB();
  const nuevo: Usuario = { ...req.body, id: Date.now() };
  db.usuarios.push(nuevo);
  writeDB(db);
  res.json(nuevo);
});
app.put('/usuarios/:id', (req: Request, res: Response) => {
  const db = readDB();
  const idx = db.usuarios.findIndex(u => u.id == Number(req.params.id));
  if (idx !== -1) {
    db.usuarios[idx] = { ...db.usuarios[idx], ...req.body };
    writeDB(db);
    res.json(db.usuarios[idx]);
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});
app.delete('/usuarios/:id', (req: Request, res: Response) => {
  const db = readDB();
  db.usuarios = db.usuarios.filter(u => u.id != Number(req.params.id));
  writeDB(db);
  res.json({ ok: true });
});

// CRUD PRODUCTOS
app.get('/productos', (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.productos);
});
app.post('/productos', (req: Request, res: Response) => {
  const db = readDB();
  const nuevo: Producto = { ...req.body, id: Date.now() };
  db.productos.push(nuevo);
  writeDB(db);
  res.json(nuevo);
});
app.put('/productos/:id', (req: Request, res: Response) => {
  const db = readDB();
  const idx = db.productos.findIndex(p => p.id == Number(req.params.id));
  if (idx !== -1) {
    db.productos[idx] = { ...db.productos[idx], ...req.body };
    writeDB(db);
    res.json(db.productos[idx]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});
app.delete('/productos/:id', (req: Request, res: Response) => {
  const db = readDB();
  db.productos = db.productos.filter(p => p.id != Number(req.params.id));
  writeDB(db);
  res.json({ ok: true });
});

// CRUD PEDIDOS
app.get('/pedidos', (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.pedidos);
});
app.post('/pedidos', (req: Request, res: Response) => {
  const db = readDB();
  const nuevo: Pedido = { ...req.body, id: Date.now() };
  db.pedidos.push(nuevo);
  writeDB(db);
  res.json(nuevo);
});
app.put('/pedidos/:id', (req: Request, res: Response) => {
  const db = readDB();
  const idx = db.pedidos.findIndex(p => p.id == Number(req.params.id));
  if (idx !== -1) {
    db.pedidos[idx] = { ...db.pedidos[idx], ...req.body };
    writeDB(db);
    res.json(db.pedidos[idx]);
  } else {
    res.status(404).json({ error: 'Pedido no encontrado' });
  }
});
app.delete('/pedidos/:id', (req: Request, res: Response) => {
  const db = readDB();
  db.pedidos = db.pedidos.filter(p => p.id != Number(req.params.id));
  writeDB(db);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
