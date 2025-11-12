// Função para atualizar o header após login/cadastro
function atualizarHeaderAposCadastro() {
  const btnLoginCadastro = document.getElementById('botoesHeader');
  const btnPerfil = document.getElementById('btn-perfil');

  if (btnPerfil && btnLoginCadastro) {
    btnPerfil.style.display = 'block';
    btnLoginCadastro.style.display = 'none';

    // Armazena no localStorage que o usuário está logado
    localStorage.setItem('usuarioLogado', 'true');
  }
}

// Função para verificar o estado de login ao carregar a página
function verificarEstadoLogin() {
  const btnLoginCadastro = document.getElementById('botoesHeader');
  const btnPerfil = document.getElementById('btn-perfil');

  if (!btnPerfil || !btnLoginCadastro) return;

  if (localStorage.getItem('usuarioLogado') === 'true') {
    btnPerfil.style.display = 'block';
    btnLoginCadastro.style.display = 'none';
  } else {
    btnPerfil.style.display = 'none';
    btnLoginCadastro.style.display = 'block';
  }
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', verificarEstadoLogin);