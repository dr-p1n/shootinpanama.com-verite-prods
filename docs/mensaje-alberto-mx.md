# Mensaje para Alberto (WhatsApp) — MX + reenvío leads@

No es urgente: el botón "Responder a …" del correo de notificación ya resuelve lo de Ricardo. Esto es
solo para que la dirección remitente deje de ser un buzón inexistente.

Contexto: `shootinginpanama.com` no tiene ningún registro MX, así que no puede recibir correo.
`mail.shootinginpanama.com` ya resuelve a 69.49.242.120 (mismo servidor que
`mail.veriteproducciones.net`), o sea que el reenvío es entrega local.

Cuando confirme: cambiar `LEAD_FROM` en [wrangler.toml](../wrangler.toml) a
`"Shoot In Panama <leads@shootinginpanama.com>"` y redesplegar.

---

> Alberto, gracias — ya verifiqué todo lo de hoy y quedó perfecto: la redirección a www funciona
> (http, https y rutas internas) y el dominio ya tiene DKIM, SPF y DMARC. El correo del sitio está
> saliendo bien.
>
> Me falta una sola cosa, menor. El dominio no tiene registro MX, así que no puede RECIBIR correo y
> cualquier respuesta a las notificaciones rebota. Tres pasos en cPanel:
>
> 1) Registro MX en el dominio raíz shootinginpanama.com
> Valor: mail.shootinginpanama.com
> Prioridad: 10
>
> 2) Un reenviador (no un buzón): leads@shootinginpanama.com → rbarria@veriteproducciones.net
>
> 3) Otro reenviador: dmarc@shootinginpanama.com → rbarria@veriteproducciones.net (o que se
> descarte). Con el MX puesto van a empezar a llegar reportes automáticos a esa dirección y sin esto
> también rebotarían.
>
> Por favor no toques lo que ya está: el TXT de resend._domainkey, el MX y el TXT de send, el _dmarc,
> el CNAME de www ni el SPF del dominio raíz.
>
> Cuando lo tengas me avisas y lo verifico.
