# DNS records to add — shootinginpanama.com (email sending via Resend)

**For:** Alberto (IT / registrar admin) · +507 6334-8380
**Requested by:** Verité Producciones / Shoot In Panama
**Purpose:** Authorize the website to send lead-notification emails from `noreplymarketing@shootinginpanama.com`.

## Important scope notes (please read first)
- These go in the **same DNS zone** as the existing `www` CNAME and the apex 301 redirect.
- **NO nameserver change.** **NO change to the root/apex MX.** Nothing here touches the website or any existing email.
- Two records use the **`send`** subdomain (a bounce/return-path subdomain) — they must be added on `send`, **not** on the root.
- If your DNS panel auto-appends the domain, enter the **short host** (left column). If it needs a fully-qualified name, use the `.shootinginpanama.com` form shown in parentheses.

## Records to add

| # | Type | Host / Name | Value / Content | Priority | TTL |
|---|------|-------------|-----------------|----------|-----|
| 1 | TXT | `resend._domainkey` (`resend._domainkey.shootinginpanama.com`) | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgYtS/SJOG18M8uFKEKjL/2YJINJcwt8JEimF/Ye9pqtfWGFchJcAdzZybEFL909bgHGdnQhXudik4Mi5iLqjBlBhjHuS4C9rBIaP37zApY/HJCY0v1NxbDr0SqrTu0UF0PlynEIgk7n0169Ht2cfYzmpO07RQVA0J3YZyT/6t4wIDAQAB` | — | Auto / 3600 |
| 2 | MX | `send` (`send.shootinginpanama.com`) | `feedback-smtp.us-east-1.amazonses.com` | 10 | Auto / 3600 |
| 3 | TXT | `send` (`send.shootinginpanama.com`) | `v=spf1 include:amazonses.com ~all` | — | Auto / 3600 |
| 4 *(optional, recommended)* | TXT | `_dmarc` (`_dmarc.shootinginpanama.com`) | `v=DMARC1; p=none;` | — | Auto / 3600 |

### Notes per record
- **#1 DKIM** — Paste the value **exactly**, including the leading `p=` and trailing `wIDAQAB`, with no added spaces or line breaks. It is one continuous string (~216 chars, fits in a single TXT value).
- **#2 MX** — This MX lives on the `send` subdomain only. It does **not** affect mail delivery for the main domain.
- **#3 SPF** — This SPF is for the `send` subdomain. Do **not** merge it into any root-domain SPF.
- **#4 DMARC** — Optional but recommended (`p=none` = monitor only, no impact on delivery). Skip if a `_dmarc` record already exists.

## Why each record (plain English)

**The big picture:** Gmail, Outlook, etc. won't trust an email that *claims* to be from `@shootinginpanama.com` unless the domain publicly vouches for the sender. These records are that proof. Without them, our notification emails get marked as spam or rejected outright.

- **#1 DKIM (`resend._domainkey` TXT)** — the most important one. It publishes a public cryptographic key. Every email we send is signed with the matching private key; the receiving mail server uses this public key to confirm the message really came from us and wasn't tampered with in transit. No DKIM → mail is untrusted.

- **#2 MX (`send`)** — sets a dedicated *return-path* subdomain (`send.shootinginpanama.com`) where bounce and complaint notices are delivered. It lives on the `send` subdomain **only**, so it has zero effect on the main domain's regular email/MX. It exists so bounces are handled cleanly and so SPF (below) can align to a domain we control.

- **#3 SPF (`send` TXT)** — a public list of who is allowed to send mail for the `send` subdomain. `include:amazonses.com` authorizes Amazon SES (the infrastructure Resend sends through); `~all` softly rejects anything else. Receiving servers check the sending server's IP against this list — a match passes SPF.

- **#4 DMARC (`_dmarc` TXT, optional)** — a policy telling receivers what to do when a message fails the above checks, plus it requests reporting. `p=none` means "monitor only, don't block anything" — safe, no delivery impact, but it establishes the record and builds domain reputation over time.

**Why the `send` subdomain?** Resend uses a custom return-path (`send.shootinginpanama.com`) so SPF authenticates against a domain we own rather than a shared Amazon one — this improves "alignment," which is exactly what raises deliverability and inbox placement.

## Mensaje para Alberto (WhatsApp, español)

> Alberto, necesito que agregues 4 registros DNS al dominio shootinginpanama.com, en la misma zona donde está el www. No cambies nameservers ni el MX principal del dominio. Esto solo habilita el envío de los correos automáticos del sitio y no afecta nada de lo actual.
>
> Registro 1 - TXT
> Nombre: resend._domainkey
> Valor: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgYtS/SJOG18M8uFKEKjL/2YJINJcwt8JEimF/Ye9pqtfWGFchJcAdzZybEFL909bgHGdnQhXudik4Mi5iLqjBlBhjHuS4C9rBIaP37zApY/HJCY0v1NxbDr0SqrTu0UF0PlynEIgk7n0169Ht2cfYzmpO07RQVA0J3YZyT/6t4wIDAQAB
> Copiar el valor completo y exacto, sin espacios ni saltos de línea.
> Para qué sirve: firma los correos para que no caigan en spam.
>
> Registro 2 - MX
> Nombre: send
> Valor: feedback-smtp.us-east-1.amazonses.com
> Prioridad: 10
> Para qué sirve: maneja los rebotes en una subdirección aparte, sin tocar el correo del dominio.
>
> Registro 3 - TXT
> Nombre: send
> Valor: v=spf1 include:amazonses.com ~all
> Para qué sirve: autoriza al servidor que envía los correos.
>
> Registro 4 - TXT (opcional)
> Nombre: _dmarc
> Valor: v=DMARC1; p=none;
> Para qué sirve: monitoreo, no afecta la entrega.
>
> Si el panel te pide el nombre completo, usa resend._domainkey.shootinginpanama.com y send.shootinginpanama.com.
>
> Cuando los tengas puestos, avísame para verificarlos.

## After the records are live
Reply to confirm they're added. We then click **Verify** in Resend (records usually resolve within minutes to a few hours) and switch email notifications on. Until then, nothing breaks — leads are already being captured.
