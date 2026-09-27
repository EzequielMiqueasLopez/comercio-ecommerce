# Despliegue en AWS

> **Estado actual:** el laboratorio de AWS aún no está activo. Esta guía documenta la arquitectura de despliegue y los pasos exactos a seguir en cuanto se active, para poder ejecutarlos sin perder tiempo investigando en ese momento.

## 1. Arquitectura propuesta

El despliegue en AWS respeta la misma separación de responsabilidades que la arquitectura hexagonal del proyecto: backend, base de datos y frontend se despliegan como componentes independientes.

| Componente | Servicio AWS | Función |
|---|---|---|
| Backend (Express) | EC2 | Ejecuta la API REST (capa de infraestructura/adaptadores) |
| Base de datos (PostgreSQL) | RDS | Persistencia de datos, administrada por AWS |
| Frontend (React + Vite) | S3 + CloudFront | Hosting estático del build de producción y distribución vía CDN |
| Variables de entorno / secretos | Variables de entorno de EC2 | Credenciales de DB, JWT secret, etc. |

### Diagrama de arquitectura

```
[Usuario]
   |
   v
[CloudFront] --- (CDN, cachea el frontend)
   |
   v
[S3 Bucket] --- (React build: index.html, JS, CSS)

[Usuario] --- llamadas API (fetch) ---> [EC2: Node/Express] ---> [RDS: PostgreSQL]
```

El usuario carga la interfaz desde CloudFront/S3 (rápido, cacheado, sin servidor que mantener), y esa interfaz hace las llamadas a la API directamente contra el backend en EC2, que a su vez habla con PostgreSQL en RDS.

---

## 2. Antes de empezar: qué preparar de este lado

Estas cosas se pueden dejar listas **ahora mismo**, sin necesitar el laboratorio activo:

- [ ] Backend funcionando localmente (✅ ya lo tienes)
- [ ] Frontend funcionando localmente (✅ ya lo tienes)
- [ ] `schema.sql` y `002_roles.sql` listos para correr contra la base en la nube
- [ ] Un archivo `.env.production` de ejemplo para el backend (sin datos reales, solo la plantilla)
- [ ] Confirmar la versión de Node que usa el proyecto (`node -v` en tu WSL) para instalar la misma en EC2

---

## 3. Pasos a seguir cuando el laboratorio esté activo

### 3.1 Crear la base de datos en RDS

1. Entra a la consola de AWS → busca **RDS** → **Create database**.
2. Motor: **PostgreSQL** (misma versión que usas en Windows, idealmente 15+).
3. Plantilla: **Free tier** (si el laboratorio lo permite) o la que indique tu profesor.
4. Configura usuario maestro y contraseña (guárdalos, los vas a necesitar en el `.env` del backend).
5. En "Connectivity", asegúrate de que el grupo de seguridad (Security Group) permita conexiones entrantes en el puerto **5432** desde la instancia EC2 que crearás después (no desde "todo internet").
6. Una vez creada, copia el **Endpoint** (algo como `basedatos.xxxxx.us-east-1.rds.amazonaws.com`) — ese será tu nuevo `DB_HOST`.
7. Desde tu EC2 (una vez creada) o con un cliente psql que tenga acceso, corre:
   ```
   psql -h <endpoint-de-rds> -U <usuario> -d postgres -f schema.sql
   psql -h <endpoint-de-rds> -U <usuario> -d comercio -f 002_roles.sql
   ```

### 3.2 Desplegar el backend en EC2

1. Consola AWS → **EC2** → **Launch instance**.
2. Imagen: **Ubuntu Server** (22.04 o similar).
3. Tipo de instancia: `t2.micro` (free tier) o la que indique el laboratorio.
4. Crea o reutiliza un **par de llaves (.pem)** para conectarte por SSH.
5. En el **Security Group** de esta instancia, abre los puertos:
   - `22` (SSH, para administrar la instancia)
   - `4000` (o el puerto de tu API — o mejor, `80`/`443` si pones un proxy Nginx delante, ver 3.4)
6. Conéctate por SSH:
   ```
   ssh -i tu-llave.pem ubuntu@<ip-publica-de-ec2>
   ```
7. Instala Node.js y git:
   ```
   sudo apt update
   sudo apt install -y nodejs npm git
   ```
8. Sube tu código (opción simple: `scp` desde tu WSL, o `git clone` si lo subiste a un repositorio):
   ```
   scp -i tu-llave.pem -r ~/proyectos/backend ubuntu@<ip-publica>:~/backend
   ```
9. En la instancia EC2, dentro de `~/backend`:
   ```
   npm install
   cp .env.example .env
   nano .env
   ```
   Configura ahí: `DB_HOST` = endpoint de RDS, `DB_PASSWORD` = la contraseña real, `JWT_SECRET` = uno nuevo y seguro (no el de desarrollo).
10. Instala `pm2` para que el servidor siga corriendo aunque cierres la sesión SSH:
    ```
    sudo npm install -g pm2
    pm2 start src/index.js --name ecommerce-backend
    pm2 save
    pm2 startup
    ```

### 3.3 Desplegar el frontend en S3 + CloudFront

1. En tu WSL, antes de compilar, edita `frontend/.env` para que `VITE_API_URL` apunte a la IP pública (o dominio) de tu EC2:
   ```
   VITE_API_URL=http://<ip-publica-de-ec2>:4000/api
   ```
2. Compila el build de producción:
   ```
   cd ~/proyectos/frontend
   npm run build
   ```
   Esto genera la carpeta `dist/`.
3. Consola AWS → **S3** → **Create bucket**. Nombre único (por ejemplo `comercio-frontend-tuapellido`). Desactiva "Block all public access" (necesario para hosting estático).
4. Sube el contenido de `dist/` al bucket (todo lo de adentro, no la carpeta en sí).
5. En las propiedades del bucket, activa **Static website hosting**, con `index.html` como documento raíz.
6. Consola AWS → **CloudFront** → **Create distribution**, usando ese bucket S3 como origen. Esto te da una URL rápida y con HTTPS para compartir.

### 3.4 (Opcional pero recomendado) Proxy con Nginx + HTTPS

Si el tiempo lo permite, en vez de exponer el puerto 4000 directo:
1. Instala Nginx en la EC2: `sudo apt install nginx`
2. Configúralo como proxy inverso del puerto 4000 hacia el 80.
3. Esto permite después agregar un certificado HTTPS gratuito con **Let's Encrypt/Certbot**.

### 3.5 Verificación final

- [ ] `http://<ip-ec2>:4000/api/health` responde `{"status":"ok"}`
- [ ] La URL de CloudFront carga la pantalla de Login
- [ ] Login/registro funcionan contra la base en RDS
- [ ] Catálogo y pedidos cargan datos reales desde RDS

---

## 4. Antes de que el laboratorio expire

Los laboratorios de AWS Academy suelen tener tiempo límite y borran todo al terminar. Antes de que expire:

1. Haz un respaldo de la base de datos:
   ```
   pg_dump -h <endpoint-rds> -U <usuario> -d comercio > respaldo_final.sql
   ```
2. Toma capturas de pantalla de la app funcionando en la URL pública (evidencia para la entrega).
3. Guarda la IP pública de EC2 y la URL de CloudFront en tu documento de entrega, junto con las capturas — aunque el laboratorio expire después, el profesor puede ver la evidencia de que sí funcionó.
