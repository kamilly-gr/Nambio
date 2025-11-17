function avançarParaEndereco() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const tel = document.getElementById('tel').value;
  const nasc = document.getElementById('nasc').value;
  const cpf = document.getElementById('cpf').value;

  if (!nome || !email || !username || !tel || !nasc || !cpf) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  document.getElementById('ctnLoginAluno1').style.display = 'none';
  document.getElementById('ctnLoginAluno2').style.display = 'block';
}

function voltarParaUsuario() {
  document.getElementById('ctnLoginAluno2').style.display = 'none';
  document.getElementById('ctnLoginAluno1').style.display = 'block';
}

const cepInput = document.getElementById('cep');
const logradouroInput = document.getElementById('logradouro');
const bairroInput = document.getElementById('bairro');
const cidadeInput = document.getElementById('cidade');
const ufInput = document.getElementById('uf');

cepInput.addEventListener('blur', () => {
  let cep = cepInput.value.replace(/\D/g, ''); // remove tudo que não for número

  // Limpa os campos ao sair do input
  logradouroInput.value = '';
  bairroInput.value = '';
  cidadeInput.value = '';
  ufInput.value = '';

  if (cep.length !== 8) {
    alert('CEP inválido. Digite um CEP com 8 números.');
    return;
  }

  // Requisição para a API do ViaCEP
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      // Verifica se a API retornou dados válidos
      if (data.erro) {
        alert('CEP não encontrado.');
        return;
      }

      // Preenche os campos do formulário
      logradouroInput.value = data.logradouro;
      bairroInput.value = data.bairro;
      cidadeInput.value = data.localidade;
      ufInput.value = data.uf;
    })
    .catch(error => {
      console.error('Erro ao buscar CEP:', error);
      alert('Erro ao consultar o CEP. Tente novamente.');
    });
});


function finalizarCadastro() {

  // verifica os valores atuais dos inputs de endereço
  const logradouro = logradouroInput.value;
  const bairro = bairroInput.value;
  const cidade = cidadeInput.value;
  const uf = ufInput.value;

  if (!logradouro || !bairro || !uf || !cidade) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

// 1. Obter os valores dos inputs
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const tel = document.getElementById('tel').value;
  const nasc = document.getElementById('nasc').value;
  const cpf = document.getElementById('cpf').value;
  const senha = document.getElementById('senha').value;
  

    
// 2. Criar um objeto com os dados
    const dadosUsuario = {
        nome: nome,
        email: email,
        username: username,
        tel: tel,
        nasc: nasc,
        cpf: cpf,
        senha: senha
    };

    // 3. Salvar o objeto no localStorage como uma string JSON
    // O localStorage só armazena strings, então precisamos serializar o objeto.
    localStorage.setItem('usuarioPerfil', JSON.stringify(dadosUsuario));

  // redireciona para a página inicial
  window.location.href = 'home.html';

  console.log('Cadastro finalizado:');
  
  alert('Cadastro realizado com sucesso!');

  // atualiza o header (marca usuário como logado) antes de redirecionar
  atualizarHeaderAposCadastro();

  
}