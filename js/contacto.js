document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.contact-card form');
    const confirm = document.getElementById('mensaje-confirmacion');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        const body = {
            nombre:   form.nombre.value.trim(),
            email:    form.email.value.trim(),
            telefono: form.telefono.value.trim(),
            asunto:   form.asunto.value.trim(),
            mensaje:  form.mensaje.value.trim()
        };

        try {
            const res = await fetch('http://127.0.0.1:8000/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.ok) {
                form.reset();
                confirm.style.display = 'block';
                confirm.style.color = '#23ff6c';
                confirm.textContent = '✅ ' + data.msg;
            } else {
                confirm.style.display = 'block';
                confirm.style.color = '#ff4444';
                confirm.textContent = '❌ ' + data.msg;
            }
        } catch {
            confirm.style.display = 'block';
            confirm.style.color = '#ff4444';
            confirm.textContent = '❌ Error de conexión. Inténtalo más tarde.';
        } finally {
            btn.disabled = false;
            btn.textContent = '📨 Enviar mensaje';
        }
    });
});
