# Web de Khali

Sitio web de Khali (samplevettadev.netlify.app), paquete landing, generado el 1 de noviembre de 2026 con el kit de webs de Vettadev.

## Qué hay aquí

- `client/site.json`: todos los textos, datos de contacto, horario, servicios, colores y tipografía de la web. Es lo único que cambia de un cliente a otro.
- `public/client/`: logo, tipografías y fotos.
- `src/`: la web en sí (Next.js, React, Tailwind). Es el mismo código para todas las webs de Vettadev; no hace falta tocarlo para cambiar un texto.

## Cómo pedir un cambio

Escriba a Vettadev por WhatsApp al +34 676 899 463 o a info@vettadev.com con lo que quiere cambiar. Los cambios pequeños de texto o imagen entran en la cuota mensual; lo demás se presupuesta antes de hacerlo. Respondemos el mismo día laborable.

## Cómo funciona por dentro

- La web se publica en Netlify a partir de este repositorio: cada cambio en la rama `main` se despliega solo.
- El formulario de contacto lo gestiona Netlify Forms y llega a: info@vettadev.com.
- El botón de WhatsApp abre el +34 676 899 463 con un mensaje preparado. El de llamar marca el +34 676 899 463.
- La analítica (Google Analytics 4) solo se carga si el visitante acepta las cookies.

## Para un desarrollador

```
npm install
npm run dev      # http://localhost:3000
npm run build    # comprobación de que compila
```

Los textos salen de `client/site.json`. Si cambia algo ahí, la web lo recoge en el siguiente despliegue. El dominio y el código son del cliente; se pueden llevar a otro proveedor cuando quiera.
