# NodoWeb CRM - App de Prospección Comercial Bahía Blanca

Aplicación móvil (APK Android) y versión web para el equipo de ventas de NodoWeb (2 usuarios). Permite seguimiento comercial de prospectos en tiempo real entre ambos dispositivos, con creación de perfiles, notas compartidas, accesos directos a llamadas/mapas/web, y carga automática de nuevos prospectos sin actualización manual.

## 📋 Tabla de Contenidos

1. [Arquitectura y Decisiones Técnicas](#arquitectura-y-decisiones-técnicas)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Configuración de Firebase](#configuración-de-firebase)
5. [Conexión GitHub + Vercel](#conexión-github--vercel)
6. [Generación de APK](#generación-de-apk)
7. [Carga de Datos Iniciales (Seed)](#carga-de-datos-iniciales-seed)
8. [Estructura del Proyecto](#estructura-del-proyecto)
9. [Scripts de Automatización](#scripts-de-automatización)
10. [Uso de la Aplicación](#uso-de-la-aplicación)

---

## 🏗️ Arquitectura y Decisiones Técnicas

### Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend móvil | **React Native + Expo SDK 58** | Permite generar APK nativa vía EAS Build y también desplegar como PWA/web en Vercel desde un mismo código. |
| Navegación | **Expo Router** | Navegación basada en archivos (file-based routing), integrada nativamente con Expo, soporte para web y native. |
| Backend | **Firebase (Firestore + Auth)** | Firestore ofrece sincronización en tiempo real out-of-the-box (WebSockets bajo el hood). Auth da email/password listo para usar. |
| Estado global | **React Context API** | Suficiente para 2 usuarios, sin complejidad de Redux/Zustand. |
| Estilos | **StyleSheet (React Native)** | Diseño nativo que preserva los colores de marca (sky-500, slate-900) de la app base PWA. |
| Despliegue web | **Vercel** | Despliegue automático por push a `main`, conectado a GitHub. |
| CI/CD | **Scripts npm + EAS** | Automatización de instalación, despliegue y generación de APK. |

### ¿Por qué Firebase en lugar de Supabase?

- Firestore tiene sincronización en tiempo real nativa con listeners (`onSnapshot`), ideal para la requisito de "el otro usuario ve los cambios al instante sin recargar".
- Firebase Auth es más simple de configurar para email/password sin necesidad de proveedores OAuth adicionales.
- SDK de Firebase es maduro en React Native/Expo.

### ¿Por qué Expo en lugar de React Native CLI?

- **EAS Build** permite generar APK firmada en la nube sin instalar Android Studio localmente.
- **Expo Router** funciona igual en web (Vercel) y en native (APK).
- **Expo Go** permite probar en dispositivos reales sin build.

### Resolución de Conflictos

Última escritura gana (last-write-wins). Firebase Firestore maneja esto automáticamente con timestamps de `serverTimestamp()`.

---

## 📋 Requisitos Previos

- Node.js v18 o superior
- npm (incluido con Node.js)
- Cuenta de [Firebase](https://console.firebase.google.com/) (gratuita, plan Spark)
- Cuenta de [GitHub](https://github.com/) (repositorio privado)
- Cuenta de [Vercel](https://vercel.com/) (gratuita)
- Cuenta de [Expo](https://expo.dev/) (para EAS Build)

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/nodoweb-crm.git
cd nodoweb-crm
```

### 2. Instalar dependencias

```bash
npm install
```

O usar el script de automatización:

```bash
node scripts/install-deps.js
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo:

```bash
copy .env.example .env
```

Editar `.env` con las credenciales de Firebase (ver sección Configuración de Firebase).

---

## 🔥 Configuración de Firebase

### Paso 1: Crear proyecto en Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear un nuevo proyecto (ej: `nodoweb-crm`)
3. No habilitar Google Analytics (opcional)

### Paso 2: Registrar app web

1. En el panel del proyecto, clic en el icono de **web** (`</>`)
2. Registrar la app con nombre `nodoweb-crm-web`
3. Copiar la configuración (`firebaseConfig`)

### Paso 3: Habilitar servicios

1. **Firestore Database**: Crear base de datos en modo de prueba (modo bloqueado para producción posterior)
2. **Authentication**: Habilitar "Email/Contraseña" en el método de inicio de sesión

### Paso 4: Configurar `.env`

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=nodoweb-crm.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=nodoweb-crm
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=nodoweb-crm.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Paso 5: Reglas de Firestore (modo desarrollo)

En Firebase Console > Firestore > Reglas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🌐 Conexión GitHub + Vercel

### 1. Crear repositorio en GitHub

```bash
git init
git add .
git commit -m "feat: versión inicial de NodoWeb CRM"
git branch -M main
git checkout -b develop
git remote add origin https://github.com/TU_USUARIO/nodoweb-crm.git
git push -u origin main
git push -u origin develop
```

### 2. Conectar a Vercel

1. Iniciar sesión en [Vercel](https://vercel.com/)
2. Clic en "Add New Project" > "Import Git Repository"
3. Seleccionar el repositorio `nodoweb-crm`
4. Configurar:
   - **Framework Preset**: Vite / Create React App (o "Other")
   - **Build Command**: `npx expo export --platform web`
   - **Output Directory**: `web-build`
   - **Install Command**: `npm install`
5. Agregar variables de entorno (mismas que en `.env`)
6. Clic en "Deploy"

### 3. Despliegue automático

Cada push a `main` desplega automáticamente en Vercel. La URL pública será algo como:
`https://nodoweb-crm.vercel.app`

---

## 📱 Generación de APK Android

### Opción A: EAS Build (recomendado, sin Android Studio)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Iniciar sesión en Expo
eas login

# Construir APK para producción
npx eas-cli@latest build -p android --profile production
```

O usar el script:

```bash
node scripts/build-apk.js
```

La APK se subirá a la nube de Expo y se podrá descargar desde el dashboard.

### Opción B: Desarrollo local

```bash
npm run android
```

### Instalación en dispositivos

1. Descargar el archivo `.apk` generado
2. En Android: Configuración > Seguridad > "Instalar aplicaciones desconocidas" (activar)
3. Abrir el APK e instalar
4. Iniciar sesión con las credenciales de cada vendedor

---

## 📦 Carga de Datos Iniciales (Seed)

Los 38 prospectos de Bahía Blanca se cargan automáticamente desde el CSV al primer arranque.

### Generar archivo de seed

```bash
node scripts/seed-data.js
```

Esto lee `C:\Users\Nacho\.gemini\antigravity\scratch\Prospectos_Bahia_Blanca_NodoWeb.csv` y genera `seed-data.json`.

### Importar a Firebase

Opción A - Desde Firebase Console:
1. Firebase Console > Firestore > Importar datos
2. Seleccionar `seed-data.json`
3. Colección: `prospects`

Opción B - Programáticamente (en una sesión de la app):
El formulario "Nuevo prospecto" permite importar CSV manualmente desde la app.

### Estructura de datos en Firestore

**Colección `prospects`:**
```
{
  id: string,
  nombre: string,
  rubro: string,
  categoria: "INMOBILIARIA" | "INDUSTRIA" | "SALUD" | "HOGAR" | "ECOMMERCE" | "OTROS",
  direccion: string,
  zona: string,
  contacto: string,
  telefonoRaw: string,
  email: string,
  whatsapp: string,
  sitioWeb: string,
  redesSociales: string,
  googleMaps: string,
  estadoWeb: string,
  dolor: string,
  solucion: string,
  precio: string,
  abono: string,
  prioridad: "ALTA" | "MEDIA",
  pitch: string,
  notas: string,
  fotos: array,
  userId: string,
  userName: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Colección `notes`:**
```
{
  id: string,
  prospectId: string,
  texto: string,
  userId: string,
  userName: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Colección `users`:**
```
{
  id: string,
  email: string,
  nombre: string,
  rol: string,
  foto: string | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 📁 Estructura del Proyecto

```
nodoweb-crm/
├── .env.example              # Plantilla de variables de entorno
├── .gitignore                # Archivos ignorados por Git
├── app.json                  # Configuración de Expo
├── eas.json                  # Configuración de EAS Build
├── vercel.json               # Configuración de Vercel
├── README.md                 # Este archivo
├── package.json              # Dependencias de npm
├── App.js                    # Punto de entrada (Expo Router)
├── index.js                  # Registro del componente raíz
├── src/
│   ├── app/                  # Rutas de Expo Router
│   │   ├── _layout.js        # Layout raíz con proveedores
│   │   ├── (auth)/
│   │   │   ├── _layout.js    # Stack de autenticación
│   │   │   ├── login.js      # Pantalla de inicio de sesión
│   │   │   └── register.js   # Pantalla de registro
│   │   ├── (app)/
│   │   │   ├── _layout.js    # Layout de pestañas (tabs)
│   │   │   ├── index.js      # Lista de prospectos
│   │   │   ├── new-prospect.js  # Formulario nuevo prospecto
│   │   │   ├── profile.js    # Perfil de usuario
│   │   │   ├── prospect/
│   │   │   │   └── [id].js   # Detalle de prospecto con acciones
│   │   │   └── notes/
│   │   │       └── [id].js   # Notas de un prospecto
│   ├── components/           # Componentes reutilizables
│   │   ├── ProspectCard.js   # Tarjeta de prospecto en lista
│   │   ├── SyncIndicator.js  # Indicador de sincronización
│   │   ├── SearchBar.js      # Buscador en tiempo real
│   │   └── FilterChips.js    # Filtros por categoría/prioridad
│   ├── context/              # Contextos de React
│   │   ├── AuthContext.js    # Autenticación (Firebase Auth)
│   │   └── ProspectsContext.js  # Prospectos y notas en tiempo real
│   ├── services/             # Servicios de Firebase
│   │   ├── firebase.js       # Configuración e inicialización
│   │   ├── prospects.js      # CRUD de prospectos (Firestore)
│   │   ├── notes.js          # CRUD de notas (Firestore)
│   │   └── users.js          # Perfiles de usuario (Firestore)
│   ├── utils/                # Utilidades
│   │   ├── csvParser.js      # Parser de CSV y mapeo a prospecto
│   │   ├── seedData.js       # Utilidad de seed desde CSV
│   │   └── formatters.js     # Formateo de teléfonos, precios, fechas
│   └── assets/               # Recursos estáticos (iconos, splash)
├── scripts/
│   ├── install-deps.js       # Instalación automática de dependencias
│   ├── deploy-vercel.js      # Despliegue a Vercel
│   ├── build-apk.js          # Generación de APK con EAS
│   └── seed-data.js          # Generación de seed desde CSV
└── android/                  # Generado por EAS (no editar manualmente)
```

---

## 🛠️ Scripts de Automatización

| Script | Comando | Descripción |
|--------|---------|-------------|
| `install-deps.js` | `node scripts/install-deps.js` | Instala todas las dependencias (npm, Expo, Firebase) |
| `deploy-vercel.js` | `node scripts/deploy-vercel.js` | Construye versión web y despliega a Vercel |
| `build-apk.js` | `node scripts/build-apk.js` | Genera APK firmada para Android con EAS Build |
| `seed-data.js` | `node scripts/seed-data.js` | Genera JSON de seed desde el CSV de prospectos |

### Scripts npm disponibles

```bash
npm start          # Iniciar servidor de desarrollo Expo
npm run android    # Iniciar en emulador/dispositivo Android
npm run web        # Iniciar versión web
```

---

## 📱 Uso de la Aplicación

### Primer uso

1. Instalar la APK en ambos dispositivos Android
2. Cada vendedor se registra con su propio email y contraseña
3. Los 38 prospectos de Bahía Blanca se cargan automáticamente desde el CSV

### Funcionalidades

| Función | Descripción |
|---------|-------------|
| **Lista de prospectos** | Vista con búsqueda en tiempo real y filtros por categoría/prioridad |
| **Ficha de prospecto** | Todos los datos comerciales: dolor, solución, inversión, abono, pitch |
| **Llamar** | Abre el marcador telefónico con el número del prospecto (`tel:`) |
| **Ubicar en Maps** | Abre Google Maps con la dirección del prospecto |
| **Abrir web** | Abre el navegador con el sitio web del prospecto |
| **WhatsApp** | Abre WhatsApp con el pitch de entrada prellenado (`wa.me`) |
| **Email** | Abre el cliente de correo con el email del prospecto (`mailto:`) |
| **Copiar pitch** | Copia el pitch de entrada al portapapeles |
| **Notas en tiempo real** | Agregar notas que se reflejan al instante en el otro dispositivo |
| **Historial de notas** | Cada nota muestra fecha, hora y usuario que la escribió |
| **Nuevo prospecto** | Formulario para crear prospectos sin actualizar el catálogo |
| **Importar CSV** | Importar prospectos desde archivo CSV |
| **Perfil de usuario** | Nombre, rol y email de cada vendedor |
| **Sincronización** | Indicador visual de "sincronizando..." o "actualizado hace X segundos" |

### Colaboración entre 2 usuarios

- Usuario A agrega una nota → Usuario B la ve al instante
- Usuario A crea un prospecto → Usuario B lo ve en su lista
- Cambios de estado se reflejan simultáneamente
- Última escritura gana en caso de conflicto

---

## 🎨 Colores de Marca

- **Primary**: Sky 500 (`#0ea5e9`) - NodoWeb
- **Background**: Slate 900 (`#0f172a`) - Headers y fondos oscuros
- **Surface**: Slate 100 / White (`#f1f5f9`, `#ffffff`)
- **Prioridad Alta**: Rose (`#fecaca` fondo, `#b91c1c` texto)
- **Prioridad Media**: Amber (`#fef3c7` fondo, `#92400e` texto)

---

## 📄 Licencia

Privado - NodoWeb Equipo de Ventas

---

## 🆘 Soporte

Para soporte técnico: soporte@nodoweb.com.ar

**Ubicación base:** Bahía Blanca, Buenos Aires, Argentina  
**Moneda:** Pesos argentinos ($)  
**Formato de teléfono:** Argentino (0291 XXXX-XXXX)
