// ================================
// FUNÇÕES DE HEADER E ESTADO DE LOGIN
// ================================

/**
 * Atualiza o header após login/cadastro
 * @param {string} tipoUsuario - 'aluno' ou 'host'
 */
function atualizarHeaderAposCadastro(tipoUsuario = 'aluno') {
    const btnLoginCadastro = document.querySelector('#botoesHeader, .botoesHeader');
    const btnPerfil = document.querySelector('#perfil-container, .perfil-container');

    if (btnPerfil) btnPerfil.style.display = 'block';
    if (btnLoginCadastro) btnLoginCadastro.style.display = 'none';

    // Salva tipo de usuário e estado de login
    localStorage.setItem('tipoUsuario', tipoUsuario);
    localStorage.setItem('usuarioLogado', 'true');
    
    console.log(`Header atualizado para ${tipoUsuario}`);
}

/**
 * Carrega foto de perfil salva no localStorage
 */
function carregarFotoPerfil() {
    const imgElement = document.getElementById('imgPerfilHeader');
    const fotoSalva = localStorage.getItem('fotoPerfilURL');
    
    if (imgElement && fotoSalva) {
        imgElement.src = fotoSalva;
        imgElement.classList.remove('icone-padrao');
        imgElement.classList.add('foto-usuario-customizada');
    }
}

/**
 * Verifica estado de login ao carregar a página
 */
function verificarEstadoLogin() {
    const btnLoginCadastro = document.querySelector('#botoesHeader, .botoesHeader');
    const btnPerfil = document.querySelector('#perfil-container, .perfil-container');
    const estaLogado = localStorage.getItem('usuarioLogado') === 'true';

    if (!btnPerfil && !btnLoginCadastro) return;

    // Mostrar/ocultar botões com base no login
    if (btnPerfil) btnPerfil.style.display = estaLogado ? 'block' : 'none';
    if (btnLoginCadastro) btnLoginCadastro.style.display = estaLogado ? 'none' : 'block';

    // Carregar foto de perfil se logado
    if (estaLogado) {
        carregarFotoPerfil();
        
        // Ajustar link do perfil conforme tipo de usuário
        const linkPerfil = btnPerfil?.querySelector('a');
        if (linkPerfil) {
            const tipoUsuario = localStorage.getItem('tipoUsuario');
            linkPerfil.href = (tipoUsuario === 'host') ? 'perfilHost.html' : 'perfil.html';
        }
    }
}

/**
 * Função para troca de foto de perfil (global)
 */
function acionarTrocaDeFoto() {
    const input = document.getElementById('inputFotoPerfil');
    if (input) input.click();
}

/**
 * Processa nova foto de perfil
 * @param {Event} event - Evento de mudança do input de arquivo
 */
function mudarFotoDePerfil(event) {
    const input = event.target;
    if (!input.files?.[0]) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imgSrc = e.target.result;
        const imgElement = document.getElementById('imgPerfilHeader');
        
        if (imgElement) {
            imgElement.src = imgSrc;
            imgElement.classList.remove('icone-padrao');
            imgElement.classList.add('foto-usuario-customizada');
        }
        
        localStorage.setItem('fotoPerfilURL', imgSrc);
        console.log("Foto de perfil atualizada e salva no LocalStorage.");
    };
    
    reader.readAsDataURL(input.files[0]);
}

// ================================
// INICIALIZAÇÃO
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar estado inicial de login
    verificarEstadoLogin();
    
    // Configurar listeners para foto de perfil
    const inputFoto = document.getElementById('inputFotoPerfil');
    if (inputFoto) {
        // Remover listeners anteriores para evitar duplicação
        inputFoto.removeEventListener('change', mudarFotoDePerfil);
        inputFoto.addEventListener('change', mudarFotoDePerfil);
    }
    
    console.log("logados.js inicializado");
});

// Função para limpar fotos temporárias quando sair do perfil
window.addEventListener('beforeunload', function() {
    if (window.location.pathname.includes('perfilHost.html')) {
        localStorage.removeItem('fotosCasaTemp');
    }
});

// Ao carregar a página de perfil, restaurar fotos temporárias
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('perfilHost.html')) {
        const fotosTemp = localStorage.getItem('fotosCasaTemp');
        if (fotosTemp) {
            exibirFotosSalvas(JSON.parse(fotosTemp)); // Reutiliza a função do perfil.js
        }
    }
});