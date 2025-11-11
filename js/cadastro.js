function avançarParaEndereco() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const tel = document.getElementById('tel').value;

  if (!nome || !email || !username || !tel) {
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

function finalizarCadastro() {
  const dados = {
    nome: document.getElementById('nome') ? document.getElementById('nome').value : '',
    email: document.getElementById('email') ? document.getElementById('email').value : '',
    cep: document.getElementById('cep') ? document.getElementById('cep').value : '',
    endereco: document.getElementById('endereco') ? document.getElementById('endereco').value : '',
    numeroCasa: document.getElementById('numeroCasa') ? document.getElementById('numeroCasa').value : ''
  };

  console.log('Cadastro finalizado:', dados);
  alert('Cadastro realizado com sucesso!');
  window.location.href = 'home.html';
}