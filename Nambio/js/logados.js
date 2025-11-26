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

// --- NOVA FUNÇÃO DE LOGOUT ---
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
  // busca elementos por id ou classe (compatibilidade entre páginas)
  const btnLoginCadastro = document.querySelector('#botoesHeader, .botoesHeader');
  const btnPerfil = document.querySelector('#perfil-container, .perfil-container, #btn-perfil, .btn-perfil');

  // se nenhum dos elementos existir, nada a fazer
  if (!btnPerfil && !btnLoginCadastro) return;

  const estaLogado = localStorage.getItem('usuarioLogado') === 'true';

  if (btnPerfil) btnPerfil.style.display = estaLogado ? 'block' : 'none';
  if (btnLoginCadastro) btnLoginCadastro.style.display = estaLogado ? 'none' : 'block';
}

// Executa ao carregar a página para garantir que o header inicie no estado correto
document.addEventListener('DOMContentLoaded', verificarEstadoLogin);