// ── GameX Helper — Chatbot local garantizado + API como bonus ─────────────

const KB = {
    productos: {
        consolas: [
            { n:"PlayStation 5",          p:"499€", d:"4K 120fps, SSD 825GB, DualSense, Wi-Fi 6" },
            { n:"PS5 Slim Digital",        p:"399€", d:"Sin lector, 1TB SSD, 30% más compacta" },
            { n:"Xbox Series X",           p:"499€", d:"4K 120fps, 1TB SSD, Xbox Game Pass" },
            { n:"Xbox Series S",           p:"299€", d:"512GB SSD, 1440p, la más económica" },
            { n:"Nintendo Switch OLED",    p:"329€", d:"Pantalla OLED 7\", 64GB, batería 9h" },
            { n:"Nintendo Switch Lite",    p:"219€", d:"Portátil, 6 colores, batería 7h" }
        ],
        juegos: [
            { n:"Spider-Man 2 (PS5)",       p:"79€"  },
            { n:"Elden Ring Shadow (PS5)",  p:"89€"  },
            { n:"God of War Ragnarök (PS5)",p:"69€"  },
            { n:"Zelda Tears of Kingdom",   p:"69€"  },
            { n:"Mario Kart 8 Deluxe",      p:"49€"  },
            { n:"FC25",                      p:"59€"  },
            { n:"Halo Infinite (Xbox)",     p:"39€"  },
            { n:"Forza Horizon 5 (Xbox)",   p:"49€"  },
            { n:"Animal Crossing (Switch)", p:"49€"  },
            { n:"Pokémon Escarlata",        p:"59€"  }
        ],
        accesorios: [
            { n:"DualSense PS5",            p:"69€"  },
            { n:"Xbox Elite Series 2",      p:"159€" },
            { n:"HyperX Cloud Alpha S",     p:"99€"  },
            { n:"Razer BlackWidow V4",      p:"139€" },
            { n:"Razer DeathAdder V3",      p:"79€"  },
            { n:"Logitech G502 X Plus",     p:"129€" },
            { n:"Monitor LG 27\" 4K 144Hz",p:"449€" },
            { n:"Monitor ASUS ROG 24\" 240Hz",p:"349€"}
        ]
    },
    tienda: {
        horario: "Lun–Vie: 10:00–20:00 | Sábado: 11:00–18:00 | Domingo: Cerrado",
        email:   "info@gamexstore.es",
        telefono:"+34 910 123 456",
        envio:   "Envío gratis en pedidos superiores a 50€. Entrega en 24–48h.",
        devolucion:"Devoluciones gratuitas en 30 días sin preguntas.",
        ubicacion: "Madrid, España"
    }
};

function localReply(msg) {
    const m = msg.toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "");

    // Saludo
    if (/^(hola|buenas|hi|hey|buenos|ola)\b/.test(m))
        return "¡Hola! Soy GameX Helper 🎮 ¿En qué puedo ayudarte hoy? Puedes preguntarme por productos, precios, horarios o envíos.";

    // Horario
    if (/horario|hora|abr|cerr|cuando|abierto/.test(m))
        return `⏰ Nuestro horario es:\n${KB.tienda.horario}`;

    // Envío / entrega
    if (/envi|envio|entrega|shipping|llegar/.test(m))
        return `🚚 ${KB.tienda.envio}`;

    // Devolución
    if (/devolu|devolver|cambio|reembolso|return/.test(m))
        return `↩️ ${KB.tienda.devolucion}`;

    // Contacto
    if (/contact|email|correo|telefon|llamar|whatsapp/.test(m))
        return `📬 Puedes contactarnos en:\n✉️ ${KB.tienda.email}\n📞 ${KB.tienda.telefono}`;

    // Preguntas sobre productos, precios, comparaciones, recomendaciones →
    // NO responder desde KB: dejar que Gemini conteste con datos reales de la BD.
    // El KB solo cubre info estática (horarios, contacto, envío, pago) que
    // no necesita IA y funciona aunque el servidor esté caído.

    // Pago
    if (/pago|pagar|tarjeta|efectivo|bizum|paypal/.test(m))
        return "💳 Aceptamos tarjeta de crédito/débito, PayPal y Bizum. El pago es seguro y encriptado.";

    // Gracias / adios
    if (/gracia|gracias|adios|hasta|bye|ciao/.test(m))
        return "¡Gracias a ti! 😊 Si necesitas algo más, aquí estaré. ¡Que disfrutes jugando! 🎮";

    // Default
    return null;
}

const history = [];

async function sendMessage() {
    const input    = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    const userMsg  = input.value.trim();
    if (!userMsg) return;

    appendMsg(messages, `<b style="color:#19A2FF;">Tú:</b> ${esc(userMsg)}`);
    input.value = '';

    const tid = 'tid-' + Date.now();
    appendMsg(messages, `<span id="${tid}" style="color:#aaa;font-style:italic;"><b style="color:#ff007f;">GameX:</b> <span class="dots">●○○</span></span>`);

    let di = 0;
    const frames = ['●○○','○●○','○○●'];
    const timer = setInterval(() => {
        const el = document.querySelector('#' + tid + ' .dots');
        if (el) el.textContent = frames[di++ % 3];
    }, 350);

    // 1. Respuesta local instantánea
    const local = localReply(userMsg);
    if (local) {
        await delay(600); // pausa natural
        clearInterval(timer);
        document.getElementById(tid)?.remove();
        appendMsg(messages, `<b style="color:#ff007f;">GameX:</b> ${local.replace(/\n/g,'<br>')}`);
        history.push({ role:'user', content:userMsg }, { role:'assistant', content:local });
        return;
    }

    // 2. API Gemini (servidor local) para preguntas complejas
    try {
        const res = await fetch('http://127.0.0.1:8000/chat', {
            method:'POST', signal: AbortSignal.timeout(15000),
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ message: userMsg })
        });
        const data = await res.json();
        if (data.response) {
            clearInterval(timer);
            document.getElementById(tid)?.remove();
            appendMsg(messages, `<b style="color:#ff007f;">GameX:</b> ${data.response}`);
            return;
        }
    } catch { /* servidor no disponible */ }

    // 3. Respuesta genérica siempre disponible
    clearInterval(timer);
    document.getElementById(tid)?.remove();
    const fallback = `No tengo información específica sobre eso, pero puedo ayudarte con:\n• Precios y stock de productos\n• Horarios de la tienda\n• Envíos y devoluciones\n• Contacto\n\n¿Sobre qué quieres saber?`;
    appendMsg(messages, `<b style="color:#ff007f;">GameX:</b> ${fallback.replace(/\n/g,'<br>')}`);
}

function appendMsg(c, html) {
    const d = document.createElement('div');
    d.style.cssText = 'margin-bottom:10px;line-height:1.6;';
    d.innerHTML = html;
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
}
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chat-input');
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
});
