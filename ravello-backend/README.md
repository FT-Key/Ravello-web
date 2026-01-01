# Ravello Backend

Backend API built with Node.js, Express, and MongoDB.

## Scripts

- `npm run dev` → Start in development mode
- `npm start` → Start in production mode

## Environment Variables
Copy `.env.example` to `.env` and set your values.


# 📧 Sistema de Emails - Guía de Uso

## 🎯 Resumen

El sistema de emails ahora es **totalmente configurable** mediante variables de entorno, permitiendo controlar el envío de emails independientemente del entorno (development/production).

---

## ⚙️ Configuración

### Variable Principal: `ENABLE_EMAILS`

Esta variable controla si los emails se envían realmente o solo se simulan:

```bash
# No enviar emails (solo registrar en consola)
ENABLE_EMAILS=false

# Enviar emails realmente
ENABLE_EMAILS=true

# Si no se especifica, usa el entorno por defecto:
# - production: emails habilitados (true)
# - development: emails deshabilitados (false)
```

---

## 🚀 Escenarios de Uso

### 1. Desarrollo Local (sin enviar emails) ✅ RECOMENDADO

```bash
NODE_ENV=development
ENABLE_EMAILS=false   # o simplemente no incluir esta línea
```

**Resultado:**
- ✅ Los emails NO se envían
- ✅ Se registran en consola con formato bonito
- ✅ Puedes ver todos los datos del email
- ✅ No necesitas configurar credenciales de email

**Salida en consola:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 [EMAIL SIMULADO - NO ENVIADO]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 Para:      cliente@ejemplo.com
📝 Asunto:    Reserva creada - RES-2024-001
🎨 Template:  reserva-creada
🌍 Entorno:   development
⚙️  Habilitado: false

📦 Datos del email:
{
  "nombreCliente": "Juan Pérez",
  "numeroReserva": "RES-2024-001",
  "paquete": "Bariloche 5 días",
  ...
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ️  Email NO enviado (emails deshabilitados)
💡 Tip: Para habilitar emails, configura ENABLE_EMAILS=true en .env
```

---

### 2. Desarrollo con Testing de Emails

```bash
NODE_ENV=development
ENABLE_EMAILS=true
EMAIL_USER=tu-email-testing@gmail.com
EMAIL_PASS=tu-app-password
```

**Resultado:**
- ✅ Los emails SÍ se envían a direcciones reales
- ✅ Útil para probar templates y contenido
- ✅ Puedes verificar que los emails se vean bien

---

### 3. Producción (emails siempre habilitados)

```bash
NODE_ENV=production
ENABLE_EMAILS=true   # Obligatorio en producción
EMAIL_USER=contacto@tu-dominio.com
EMAIL_PASS=contraseña-segura
```

**Resultado:**
- ✅ Todos los emails se envían normalmente
- ✅ Notificaciones a clientes funcionan
- ✅ Emails de admin funcionan

---

## 📝 Uso en el Código

### Enviar email con template

```javascript
import { sendEmail } from '../services/email.service.js';

await sendEmail({
  to: 'cliente@ejemplo.com',
  subject: 'Reserva creada - RES-2024-001',
  template: 'reserva-creada',
  data: {
    nombreCliente: 'Juan Pérez',
    numeroReserva: 'RES-2024-001',
    paquete: 'Bariloche 5 días',
    fechaSalida: '15/02/2024',
    cantidadPasajeros: 2,
    montoTotal: 50000,
    moneda: 'ARS'
  }
});
```

### Enviar email al administrador

```javascript
import { sendAdminEmail } from '../services/email.service.js';

await sendAdminEmail({
  subject: 'Nueva reserva creada',
  message: 'Se ha creado una nueva reserva en el sistema',
  data: {
    reservaId: 'RES-2024-001',
    cliente: 'Juan Pérez',
    monto: 50000
  }
});
```

### Enviar email personalizado

```javascript
import { sendCustomEmail } from '../services/email.service.js';

await sendCustomEmail({
  to: 'cliente@ejemplo.com',
  subject: 'Bienvenido',
  html: '<h1>Hola!</h1><p>Bienvenido a nuestra plataforma</p>',
  text: 'Hola! Bienvenido a nuestra plataforma'
});
```

---

## 🎨 Templates Disponibles

| Template | Uso | Datos requeridos |
|----------|-----|------------------|
| `reserva-creada` | Nueva reserva | `nombreCliente`, `numeroReserva`, `paquete`, `fechaSalida`, `cantidadPasajeros`, `montoTotal`, `moneda` |
| `reserva-confirmada` | Reserva confirmada | `nombreCliente`, `numeroReserva`, `paquete`, `fechaSalida` |
| `reserva-cancelada` | Reserva cancelada | `nombreCliente`, `numeroReserva`, `paquete`, `motivo` |
| `cuota-vencida` | Recordatorio de cuota | `nombreCliente`, `numeroReserva`, `paquete` |

---

## 🔍 Debugging

### Ver si los emails están habilitados

```javascript
const isEnabled = process.env.ENABLE_EMAILS === 'true' || 
                  (process.env.ENABLE_EMAILS === undefined && process.env.NODE_ENV === 'production');

console.log('Emails habilitados:', isEnabled);
```

### Forzar modo simulación (útil para tests)

```javascript
process.env.ENABLE_EMAILS = 'false';
```

---

## ⚠️ Consideraciones Importantes

### Desarrollo
- ✅ **Recomendado:** `ENABLE_EMAILS=false` para no molestar con emails de prueba
- ⚠️ Si usas `ENABLE_EMAILS=true`, usa un email de testing, no emails reales de clientes

### Producción
- ⚠️ **CRÍTICO:** Siempre configurar `ENABLE_EMAILS=true`
- ⚠️ **CRÍTICO:** Configurar credenciales válidas de email
- ⚠️ **CRÍTICO:** Configurar `ADMIN_EMAIL` para recibir notificaciones

### Testing
- ✅ Puedes crear un archivo `.env.testing` con `ENABLE_EMAILS=true`
- ✅ Usa emails desechables o de testing para pruebas

---

## 🐛 Troubleshooting

### "Email NO enviado (emails deshabilitados)"

**Solución:** Configurar `ENABLE_EMAILS=true` en tu `.env`

### Los emails no llegan en producción

**Verificar:**
1. ✅ `ENABLE_EMAILS=true` está configurado
2. ✅ `EMAIL_USER` y `EMAIL_PASS` son correctos
3. ✅ El puerto y host son correctos (`smtp.gmail.com:465`)
4. ✅ Si usas Gmail, necesitas un "App Password" (no tu contraseña normal)

### Errores de autenticación

**Para Gmail:**
1. Activar verificación en 2 pasos
2. Generar "App Password" en: https://myaccount.google.com/apppasswords
3. Usar ese password en `EMAIL_PASS`

---

## 📚 Ejemplos Completos

### Ejemplo 1: Desarrollo sin emails

```bash
# .env
NODE_ENV=development
ENABLE_EMAILS=false
```

```javascript
// En tu código
await sendEmail({...}); 
// Solo registra en consola, no envía
```

---

### Ejemplo 2: Testing con emails reales

```bash
# .env.testing
NODE_ENV=development
ENABLE_EMAILS=true
EMAIL_USER=testing@gmail.com
EMAIL_PASS=app-password-aqui
ADMIN_EMAIL=tu-email@gmail.com
```

```javascript
// Los emails se envían realmente
await sendEmail({...});
await sendAdminEmail({...});
```

---

### Ejemplo 3: Producción

```bash
# .env.production
NODE_ENV=production
ENABLE_EMAILS=true
EMAIL_USER=contacto@tu-dominio.com
EMAIL_PASS=password-seguro
ADMIN_EMAIL=admin@tu-dominio.com
```

```javascript
// Todos los emails se envían normalmente
await sendEmail({...});
```

---

## 🎓 Mejores Prácticas

1. ✅ **Desarrollo:** Siempre usar `ENABLE_EMAILS=false`
2. ✅ **Testing:** Crear archivo `.env.testing` separado
3. ✅ **Producción:** Validar configuración antes de deploy
4. ✅ Nunca commitear archivos `.env` al repositorio
5. ✅ Usar `.env.example` para documentar variables necesarias
6. ✅ Logs claros ayudan a debugging (el sistema ya los incluye)

---

## 🔐 Seguridad

- 🔒 Nunca uses tu contraseña personal de Gmail
- 🔒 Siempre usa "App Passwords" para Gmail
- 🔒 No compartas tus archivos `.env`
- 🔒 Usa variables de entorno en producción (no archivos)
- 🔒 Rota passwords periódicamente

---

## 📞 Soporte

Si tienes problemas con el sistema de emails:

1. Verifica los logs en consola
2. Revisa la configuración de `.env`
3. Confirma que las credenciales son correctas
4. Verifica que `ENABLE_EMAILS` esté configurado apropiadamente