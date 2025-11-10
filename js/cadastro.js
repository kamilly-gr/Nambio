function avançarParaEndereco() {
  // validação antes de avançar
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  if (!nome || !email) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  // Esconde o primeiro container e mostra o segundo
  document.getElementById('cadastroContainer1').style.display = 'none';
  document.getElementById('cadastroContainer2').style.display = 'block';
}

function voltarParaUsuario() {
  // Volta para a primeira etapa
  document.getElementById('cadastroContainer2').style.display = 'none';
  document.getElementById('cadastroContainer1').style.display = 'block';
}

function finalizarCadastro() {
  // Aqui você pode coletar todos os dados e enviar

  
  const dados = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    rua: document.getElementById('rua').value,
    cidade: document.getElementById('cidade').value
  };

  console.log('Cadastro finalizado:', dados);
  alert('Cadastro realizado com sucesso!');
  // Aqui você poderia enviar para um backend com fetch(), por exemplo
}