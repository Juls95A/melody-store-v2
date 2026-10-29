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

Usé Claude Code para ir generando el código por pasos: primero el backend y luego el frontend. Después de cada paso lo probaba y hacía commit. Cosas que tuve que corregir o decidir:

- El backend estaba en el puerto 3000 y chocaba con Next.js, así que lo pasé al 4000.
- La URL que me dio Neon traía -pooler y channel_binding, y tuve que quitarlos para que Prisma funcionara. Tampoco usé el prompt automático que da Neon, porque podía conectar la base sin Prisma.
- Al principio la IA tomó colores verde y naranja del CSS, pero mi sitio de la Entrega 1 en realidad se ve negro y rojo, así que lo cambié.
- La paginación no se notaba porque tengo pocos productos por categoría. Agregué al backend el filtro de varias categorías y dejé 4 productos por página.
- El catálogo había perdido las secciones por categoría del original, y las volví a poner.
- Pedí agregar una canasta para comprar varios productos, con dirección de envío y método de pago, sin guardar datos de tarjeta.
- En Windows me salió un error EPERM con la carpeta .next porque había dos servidores de Next abiertos a la vez. Lo arreglé borrando .next y corriendo uno solo.


## Captura de Network

![Captura de Network](melody-store.png)
