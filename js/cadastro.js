function avançarParaDados() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  if (!nome || !email) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  document.getElementById('ctnLoginAluno1').style.display = 'none';
  document.getElementById('ctnLoginAluno2').style.display = 'block';

}

function voltarParaEtapa1() {
  document.getElementById('ctnLoginAluno1').style.display = 'block';
  document.getElementById('ctnLoginAluno2').style.display = 'none';
}


function avançarParaEndereco() {
  const tel = document.getElementById('tel').value;
  const nasc = document.getElementById('nasc').value;
  const cpf = document.getElementById('cpf').value;

  if (!tel || !nasc || !cpf) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  document.getElementById('ctnLoginAluno2').style.display = 'none';
  document.getElementById('ctnLoginAluno3').style.display = 'block';

}


function voltarParaEtapa2() {
  document.getElementById('ctnLoginAluno2').style.display = 'block';
  document.getElementById('ctnLoginAluno3').style.display = 'none';
}

const cepInput = document.getElementById('cep');
const logradouroInput = document.getElementById('logradouro');
const bairroInput = document.getElementById('bairro');
const cidadeInput = document.getElementById('cidade');
const ufInput = document.getElementById('uf');

if (cepInput) {
  cepInput.addEventListener('blur', () => {
    let cep = (cepInput.value || '').toString().replace(/\D/g, ''); // remove tudo que não for número

    // Limpa os campos ao sair do input
    if (logradouroInput) logradouroInput.value = '';
    if (bairroInput) bairroInput.value = '';
    if (cidadeInput) cidadeInput.value = '';
    if (ufInput) ufInput.value = '';

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
        if (logradouroInput) logradouroInput.value = data.logradouro || '';
        if (bairroInput) bairroInput.value = data.bairro || '';
        if (cidadeInput) cidadeInput.value = data.localidade || '';
        if (ufInput) ufInput.value = data.uf || '';
      })
      .catch(error => {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao consultar o CEP. Tente novamente.');
      });
  });
}


function avançarParaSenha() {
  const logradouro = logradouroInput.value;
  const bairro = bairroInput.value;
  const cidade = cidadeInput.value;
  const uf = ufInput.value;

  if (!logradouro || !bairro || !uf || !cidade) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  document.getElementById('ctnLoginAluno3').style.display = 'none';
  document.getElementById('ctnLoginAluno4').style.display = 'block';
}

function mostrarSenha() {
  let botao = document.getElementById("botao-senha1")
  let campo = document.getElementById("senha1")

  if (campo.type === "password") {
    campo.type = "text"
    botao.style.backgroundImage = "url(/Nambio/assets/icons/olho-senha.svg)"
    botao.style.backgroundRepeat = "no-repeat"
    botao.style.backgroundPosition = "center"
    botao.style.backgroundImage = "contain"
  } else {
    campo.type = "password"
    botao.style.backgroundImage = "url(/Nambio/assets/icons/olho-senha-fechado.svg)"
    botao.style.backgroundRepeat = "no-repeat"
    botao.style.backgroundPosition = "center"
    botao.style.backgroundImage = "contain"
  }

}

function finalizarCadastro() {

  // obter valores com segurança (evita erro se elemento ausente)
  const nome = document.getElementById('nome') ? document.getElementById('nome').value : '';
  const email = document.getElementById('email') ? document.getElementById('email').value : '';
  const tel = document.getElementById('tel') ? document.getElementById('tel').value : '';
  const nasc = document.getElementById('nasc') ? document.getElementById('nasc').value : '';
  const cpf = document.getElementById('cpf') ? document.getElementById('cpf').value : '';
  const senha = document.getElementById('senha') ? document.getElementById('senha').value : '';
  const confirmNovaSenha = document.getElementById('confirmNovaSenha').value.trim();
  let caracteresRN = document.getElementById("caracteresRN");
  let minusculaRN = document.getElementById("minusculaRN");
  let maiusculaRN = document.getElementById("maiusculaRN");
  let numeroRN = document.getElementById("numeroRN");
  let especialRN = document.getElementById("especialRN");

  // Validação: todos os campos preenchidos
  if (!senha || !confirmNovaSenha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Validação: confirmação coincide
  if (senha !== confirmNovaSenha) {
    alert("A confirmação da senha não corresponde à nova senha!");
    return;
  }

  if (caracteresRN.classList.contains("desativado") || maiusculaRN.classList.contains("desativado") || minusculaRN.classList.contains("desativado") || numeroRN.classList.contains("desativado") || especialRN.classList.contains("desativado")) {
    alert("A senha não atende aos requisitos de segurança. Por favor, verifique as regras.");
    return;
  }

  // 2. Criar um objeto com os dados
  const dadosUsuario = {
    nome: nome,
    email: email,
    tel: tel,
    nasc: nasc,
    cpf: cpf,
    senha: senha,
    tipo: 'aluno'
  };

  // 3. Salvar o objeto no localStorage como uma string JSON
  // O localStorage só armazena strings, então precisamos serializar o objeto.
  localStorage.setItem('usuarioPerfil', JSON.stringify(dadosUsuario));

  console.log('Cadastro finalizado:');
  alert('Cadastro realizado com sucesso!');

  // atualiza o header (marca usuário como logado) antes de redirecionar
  atualizarHeaderAposCadastro();

  // redireciona para a página inicial
  window.location.href = 'home.html';

}

function mostrarSenha() {
  const senhaInput = document.getElementById('senha');
  const botao = document.getElementById('botao-senha');

  if (!senhaInput || !botao) {
    console.error('❌ Elementos #senha ou #botao-senha não encontrados!');
    return;
  }

  const isPassword = senhaInput.type === 'password';
  senhaInput.type = isPassword ? 'text' : 'password';

  botao.classList.toggle('mostrando', isPassword);
  botao.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');

  console.log('👁️ Modo:', isPassword ? 'texto (mostrando)' : 'senha (oculto)');
}

function mostrarSenha2() {
  const senhaInput = document.getElementById('confirmNovaSenha');
  const botao = document.getElementById('botao-senha2');

  if (!senhaInput || !botao) {
    console.error('❌ Elementos #senha ou #botao-senha não encontrados!');
    return;
  }

  const isPassword = senhaInput.type === 'password';
  senhaInput.type = isPassword ? 'text' : 'password';

  botao.classList.toggle('mostrando', isPassword);
  botao.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');

  console.log('👁️ Modo:', isPassword ? 'texto (mostrando)' : 'senha (oculto)');
}

let caracteresRN = document.getElementById("caracteresRN");
let minusculaRN = document.getElementById("minusculaRN");
let maiusculaRN = document.getElementById("maiusculaRN");
let numeroRN = document.getElementById("numeroRN");
let especialRN = document.getElementById("especialRN");

function senhaRequirements() {
  let senha = document.getElementById("senha").value;

  console.log(senha.length)

  if (senha.length >= 8) {
    caracteresRN.classList.remove("desativado");
    caracteresRN.classList.add("ativado");
  }
  else {
    caracteresRN.classList.remove("ativado");
    caracteresRN.classList.add("desativado");
  }

  if (senha.match(/[a-z]/)) {
    minusculaRN.classList.remove("desativado");
    minusculaRN.classList.add("ativado");
  }
  else {
    minusculaRN.classList.remove("ativado");
    minusculaRN.classList.add("desativado");
  }

  if (senha.match(/[A-Z]/)) {
    maiusculaRN.classList.remove("desativado");
    maiusculaRN.classList.add("ativado");
  }
  else {
    maiusculaRN.classList.remove("ativado");
    maiusculaRN.classList.add("desativado");
  }
  if (senha.match(/[0-9]/)) {
    numeroRN.classList.remove("desativado");
    numeroRN.classList.add("ativado");
  }
  else {
    numeroRN.classList.remove("ativado");
    numeroRN.classList.add("desativado");
  }
  if (senha.match(/[#\$%\^&\*\(\)_\+\-=\[\]\{\};':"\\|,.<>\/\?]/)) {
    especialRN.classList.remove("desativado");
    especialRN.classList.add("ativado");
  }
  else {
    especialRN.classList.remove("ativado");
    especialRN.classList.add("desativado");
  }

}