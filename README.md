# Melody Store

Este es el frontend de mi tienda de instrumentos musicales, la Entrega 3 de Desarrollo Web. Pasé mi sitio de la Entrega 1, que estaba hecho con HTML, CSS y JS, a Next.js. Mantuve los textos, las imágenes y el estilo negro y rojo que ya tenía.

- Sitio: https://melody-store-v2.vercel.app
- API: https://melody-store-api.onrender.com
- Backend: https://github.com/Juls95A/melody-store-api

## Qué usé

Next.js (App Router), TypeScript y Tailwind.

## Cómo está organizado

En `app/` están las páginas, y cada una solo arma la vista con componentes. La lógica está en `src/features`, separada en `common`, `auth`, `productos` y `solicitudes`. Cada feature tiene sus componentes, hooks, services y tipos. Decidí que ningún componente use `fetch` directo: todo pasa por `http.ts`, después por los services y por último por los hooks.

## Qué se puede hacer

Se puede ver el catálogo por categorías, con paginación y filtros, y agregar productos a la canasta. Desde la canasta se hace el pedido con dirección de envío y método de pago, y después se puede ver en Mis solicitudes. El admin puede crear, editar y eliminar productos, y cambiar el estado de los pedidos.

## Páginas

| Ruta | Quién puede entrar |
| --- | --- |
| `/` | Todos |
| `/instrumentos` | Todos |
| `/accesorios` | Todos |
| `/nosotros` | Todos |
| `/contacto` | Todos |
| `/canasta` | Todos (para hacer el pedido hay que iniciar sesión) |
| `/login` | Solo sin sesión |
| `/registro` | Solo sin sesión |
| `/mis-solicitudes` | Usuarios con sesión |
| `/admin` | Solo admin |

## Correrlo en local

```bash
npm install
echo "NEXT_PUBLIC_API_HOST=http://localhost:4000" > .env.local
npm run dev
```

El backend tiene que estar corriendo en el puerto 4000 para que funcione.

## Usuarios de prueba

- Admin: `admin@melodystore.com` / `Admin123*`
- Usuario: `user@melodystore.com` / `User123*`

Estos usuarios son solo para la entrega.

## Despliegue

Lo subí a Vercel con auto-deploy desde `main`. En Vercel configuré `NEXT_PUBLIC_API_HOST` apuntando a la API en Render.

## Decisiones técnicas

### Flujo de un login

Cuando lleno el formulario de /login, el componente LoginForm valida que el correo y la contraseña estén bien escritos. Después el hook useAuth llama a authService.login, que usa la función request de http.ts para hacer un POST a /api/auth/login.

En el backend, primero el middleware validar revisa el body con zod. Luego el caso de uso login busca el usuario por email y compara la contraseña con bcrypt. Si coincide, se firma un JWT con JWT_SECRET que solo lleva el id y el role, y que vence en 1 día. La API responde el token y los datos del usuario, sin la contraseña.

El frontend guarda el token y el usuario en localStorage, y la barra de navegación cambia. Cuando entro a Mis solicitudes, http.ts agrega solo el header Authorization: Bearer <token>. En el backend, el middleware autenticar verifica el token, deja el usuario en req.user y el controlador devuelve solo las solicitudes de ese usuario.

### Dónde guardo el token y qué riesgo tiene

Lo guardo en localStorage con la clave melody_token. Lo elegí porque es sencillo y la sesión no se pierde al recargar la página. El riesgo es que si la página tuviera una falla de XSS, un script podría leer el token y usarlo. Una opción más segura sería guardarlo en una cookie httpOnly. Para reducir el problema, el token dura poco (1 día) y solo lleva el id y el role, nada de datos sensibles.

### Cuándo responde 401 y cuándo 403

La API responde 401 cuando no sabe quién eres: no mandas token, el token está mal o ya venció. Responde 403 cuando sí sabe quién eres pero no tienes permiso.

Un ejemplo real: un DELETE a /api/productos/1 sin token da 401. La misma petición con el token de user@melodystore.com da 403, porque borrar productos es solo para admin. Lo probé en la API desplegada en Render y dio esos códigos. En el frontend, si una petición da 401, http.ts borra la sesión y me lleva a /login.

### Uso de IA

Usé Claude Code como apoyo: me dio guías para poder conectar las cosas (backend, frontend y base de datos).


## Captura de Network

![Captura de Network](melody-store.png)
