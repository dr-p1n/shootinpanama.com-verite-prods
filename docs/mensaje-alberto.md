# Mensaje único para Alberto (WhatsApp) — DNS de correo + redirección HTTPS

Combina las dos tareas de Bluehost: los registros DNS de Resend (correo) y el arreglo del redirect HTTPS del dominio sin www. Copiar/pegar tal cual.

Detalle técnico y verificación en [resend-dns-for-alberto.md](resend-dns-for-alberto.md) y [apex-redirect-fix.md](apex-redirect-fix.md).

---

> Alberto, necesito dos cosas en el dominio shootinginpanama.com. Ninguna cambia los nameservers ni afecta lo que ya funciona.
>
> PARTE 1 - Registros DNS (para activar los correos automáticos del sitio)
> Agrega estos registros en la misma zona donde está el www:
>
> Registro 1 - TXT
> Nombre: resend._domainkey
> Valor: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgYtS/SJOG18M8uFKEKjL/2YJINJcwt8JEimF/Ye9pqtfWGFchJcAdzZybEFL909bgHGdnQhXudik4Mi5iLqjBlBhjHuS4C9rBIaP37zApY/HJCY0v1NxbDr0SqrTu0UF0PlynEIgk7n0169Ht2cfYzmpO07RQVA0J3YZyT/6t4wIDAQAB
> Copiar el valor completo y exacto, sin espacios ni saltos de línea.
>
> Registro 2 - MX
> Nombre: send
> Valor: feedback-smtp.us-east-1.amazonses.com
> Prioridad: 10
>
> Registro 3 - TXT
> Nombre: send
> Valor: v=spf1 include:amazonses.com ~all
>
> Registro 4 - TXT (opcional)
> Nombre: _dmarc
> Valor: v=DMARC1; p=none;
>
> Si el panel te pide el nombre completo, usa resend._domainkey.shootinginpanama.com y send.shootinginpanama.com.
>
> PARTE 2 - Redirección del dominio sin www (arreglar solo el HTTPS)
> Ahora mismo https://shootinginpanama.com muestra el sitio viejo (VERITE.SERVICES); debe redirigir a https://www.shootinginpanama.com, que es el sitio nuevo. En http ya redirige bien; el problema es solo en https.
> En el hosting de Bluehost, edita el archivo .htaccess en la raíz del dominio (public_html o la carpeta del dominio) y agrega al inicio:
>
> RewriteEngine On
> RewriteCond %{HTTP_HOST} ^shootinginpanama\.com$ [NC]
> RewriteRule ^ https://www.shootinginpanama.com%{REQUEST_URI} [L,R=301]
>
> Si el archivo ya tiene "RewriteEngine On", no lo repitas, solo agrega las dos líneas de abajo.
>
> Cuando tengas las dos cosas puestas, me avisas y las verifico.
