console.log("✅ Script cargado");

function buscarPagina() {
    let query = document.getElementById("searchInput").value.toLowerCase();

    let paginas = {
        "inicio": "index.html",
        "albumes": "albumes.html",
        "amanece": "amanece.html",
        "antes de que nos olviden": "antesNosolviden.html",
        "bestia humana": "bestiaHumana.html",
        "celula que explota": "celulaExplota.html",
        "conciertos": "conciertos.html",
        "cuentame tu vida": "cuentameTuVida.html",
        "detras de ti": "detrasDeTi.html",
        "dioses ocultos": "diosesOcultos.html",
        "el elefante": "elEfante.html",
        "estoy mirando": "estoyMirando.html",
        "la negra tomasa": "laNegraTomasa.html",
        "la vida no es eterra": "laVidaNoEsEterna.html",
        "linea del tiempo": "lineadel tiempo.html",
        "matenme porque me muero": "MatenmepqmeMuero.html",
        "nada": "nada.html",
        "negro cosmico": "negorCosmico.html",
        "de noche todos los gatos son pardos":"nocheGatosPardos.html",
        "nunca me voy a transformar en ti": "nuncaMeVoyATransformar.html",
        "perdi mi ojo de venaado":"perdiMiOjoVenado.html",
        "sera por eso":"seraporEso.html",
        "sombras en tiempos perdidos":"sombrasTiemposPerdidos.html",
        "te estoy mirando":"teEstoyMirando.html",
        "la vida no es eterna":"vidaNoEterna.html",
        "viento":"viento.html",
        "vuela lejos":"vuelaLejos.html"
    };

    if (paginas[query]) {
        window.location.href = paginas[query];
    } else {
        alert("Página no encontrada, intenta con otra palabra clave.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const esLocal = location.protocol === 'file:';

    // Manejo de búsqueda
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                if (this.value.trim()) {
                    buscarPagina(); // Define esta función si la usas
                }
            }
        });
    }

    // Manejo de comentarios
    const form = document.getElementById('comentarioForm');
    const ul = document.getElementById('comentarios');

    function renderizarComentarios(comentarios) {
        ul.innerHTML = comentarios.map(c => `<li>${c.mensaje || c}</li>`).join('');
    }

    async function cargarComentarios() {
        if (esLocal) {
            const comentarios = JSON.parse(localStorage.getItem("comentarios") || "[]");
            renderizarComentarios(comentarios);
        } else {
            try {
                const res = await fetch('/comentarios');
                const comentarios = await res.json();
                renderizarComentarios(comentarios);
            } catch (error) {
                console.error("Error al cargar comentarios:", error);
            }
        }
    }

    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            if (esLocal) {
                // Guarda en localStorage
                const comentarios = JSON.parse(localStorage.getItem("comentarios") || "[]");
                comentarios.unshift(data.mensaje);
                localStorage.setItem("comentarios", JSON.stringify(comentarios));
                renderizarComentarios(comentarios);
                form.reset();
            } else {
                // Envía al servidor
                try {
                    const res = await fetch('/comentarios', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    if (res.ok) {
                        form.reset();
                        cargarComentarios();
                    } else {
                        console.error("Error al guardar comentario:", await res.text());
                    }
                } catch (error) {
                    console.error("Error al enviar comentario:", error);
                }
            }
        });
    }

    cargarComentarios();
});

function buscarPagina() {
    console.log("Buscar función ejecutada");
}