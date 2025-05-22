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

document.getElementById("searchInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita el comportamiento por defecto
        if (this.value.trim()) {
            buscarPagina();
        }
    }
});


async function cargarComentarios() {
    try {
        const res = await fetch('/comentarios');
        const comentarios = await res.json();
        console.log("Comentarios recibidos:", comentarios);
        const ul = document.getElementById('comentarios');
        ul.innerHTML = comentarios.map(c => `<li>${c.mensaje}</li>`).join('');
    } catch (error) {
        console.error("Error al cargar comentarios:", error);
    }
}

document.getElementById('comentarioForm').addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    await fetch('/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    e.target.reset();
    cargarComentarios();
});

cargarComentarios();

function cargarComentariosLocalmente() {
    let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

    const ul = document.getElementById('comentarios');
    ul.innerHTML = ""; // Limpia la lista antes de agregar nuevos comentarios

    comentarios.forEach(c => {
        const li = document.createElement("li");
        li.textContent = c;
        ul.appendChild(li);
    });
}

// Ejecutar la función cuando la página se carga
document.addEventListener("DOMContentLoaded", cargarComentariosLocalmente);
