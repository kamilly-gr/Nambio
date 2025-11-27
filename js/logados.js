// Função para atualizar o header após login/cadastro
function atualizarHeaderAposCadastro() {
  // busca elementos por id ou por classe para suportar variações nas páginas
  const btnLoginCadastro = document.querySelector('#botoesHeader, .botoesHeader');
  const btnPerfil = document.querySelector('#perfil-container, .perfil-container, #btn-perfil, .btn-perfil');

  // mostra/oculta se os elementos existirem
  if (btnPerfil) btnPerfil.style.display = 'block';
  if (btnLoginCadastro) btnLoginCadastro.style.display = 'none';

  // Armazena no localStorage que o usuário está logado (sempre que a função for chamada)
  localStorage.setItem('usuarioLogado', 'true');
}

// --- FUNÇÃO DE LOGOUT ---
function fazerLogout() {
  // Remove a flag de login do localStorage
  localStorage.removeItem('usuarioLogado');

  // Redireciona o usuário para a página inicial (descomente se quiser)
  window.location.href = 'home.html';

  // Alerta sobre a saida do site
  alert('Você saiu da sua conta!');

  // Atualiza o visual do header usando a função que já verifica o estado
  verificarEstadoLogin();
}
// ----------------------------

// Função para verificar o estado de login ao carregar a página
function verificarEstadoLogin() {
  const btnLoginCadastro = document.querySelector('#botoesHeader, .botoesHeader');
  const btnPerfil = document.querySelector('#perfil-container, .perfil-container, #btn-perfil, .btn-perfil');

  const imgPerfilHeader = document.getElementById('imgPerfilHeader');

  if (!btnPerfil && !btnLoginCadastro) return;

  const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
  const fotoPerfilURL = localStorage.getItem('fotoPerfilURL'); // <-- Pega a URL salva

  // Mostrar/ocultar botões
  if (btnPerfil) btnPerfil.style.display = estaLogado ? 'block' : 'none';
  if (btnLoginCadastro) btnLoginCadastro.style.display = estaLogado ? 'none' : 'block';

    // --- Lógica para carregar a foto de perfil ---
  if (estaLogado && imgPerfilHeader && fotoPerfilURL) {
    // Define a src da imagem como a URL salva pelo input de upload
    imgPerfilHeader.src = fotoPerfilURL;
    // Adiciona classes CSS para estilizar a foto
    imgPerfilHeader.classList.remove('icone-padrao'); 
    imgPerfilHeader.classList.add('foto-usuario-customizada');
  }

  // If que ajusta o link do perfil conforme o tipo de usuário // aluno ou host.
  if (estaLogado && btnPerfil) {
    const link = btnPerfil.querySelector('a');
    if (link) {
      const usuario = JSON.parse(localStorage.getItem('usuarioPerfil'));
      if (usuario && usuario.tipo === 'host') {
        link.href = 'perfilHost.html'; // padrão para host
      } else {
        link.href = 'perfil.html'; // padrão para aluno
      }
    }
  }
}

// Função 1: Chamada quando o botão visível é clicado
function acionarTrocaDeFoto() {
    // Simula um clique no input de arquivo oculto
    document.getElementById('inputFotoPerfil').click();
}

// Função 2: Chamada automaticamente quando o usuário seleciona um arquivo
// Você precisa adicionar um 'event listener' para isso
document.getElementById('inputFotoPerfil').addEventListener('change', mudarFotoDePerfil);


// Função 3: A lógica principal que processa a imagem (a mesma da resposta anterior)
function mudarFotoDePerfil(event) {
    const input = event.target;
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imgSrc = e.target.result;
            
            // 1. Atualiza a imagem no header da página atual (se o elemento existir na tela)
            const imgElement = document.getElementById('imgPerfilHeader');
            if (imgElement) {
                imgElement.src = imgSrc;
                // Adicione classes CSS se quiser estilizar a foto customizada
                // imgElement.classList.add('foto-usuario-customizada'); 
            }

            // 2. Salva a imagem (como string Base64) no localStorage para persistência
            localStorage.setItem('fotoPerfilURL', imgSrc);

            console.log("Foto de perfil atualizada e salva no LocalStorage.");
        };
        
        // Lê o arquivo como uma URL de dados (Base64)
        reader.readAsDataURL(input.files[0]);
    }
}

// Executa ao carregar a página para garantir que o header inicie no estado correto
document.addEventListener('DOMContentLoaded', verificarEstadoLogin);

