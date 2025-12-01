document.addEventListener('DOMContentLoaded', function() {
  
  // ================================
  // LIMITADORES DE DIGITOS (mantendo sua estrutura)
  // ================================
  
  function limitarDigitos(id, maxDigits) {
    const campo = document.getElementById(id);
    if (!campo) return;

    campo.addEventListener('input', function (e) {
      // Remove tudo que não é número
      let valor = e.target.value.replace(/\D/g, '');

      // Limita ao número máximo de dígitos
      if (valor.length > maxDigits) {
        valor = valor.slice(0, maxDigits);
      }

      // Converte para número (opcional, para evitar "000123")
      const num = valor === '' ? '' : parseInt(valor, 10);

      // Atualiza o valor
      e.target.value = num === 0 && valor === '' ? '' : (num || '');
    });

    // Impede digitação de letras em tempo real
    campo.addEventListener('keydown', function (e) {
      if (e.key.length === 1 && /\D/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
        e.preventDefault();
      }
    });
  }

  // Aplica limite de 2 dígitos para cômodos
  limitarDigitos('quantComodos', 2);

  // Aplica limite de 6 dígitos para renda familiar
  limitarDigitos('rendaFam', 6);
  
  // ================================
  // FUNÇÕES DE NAVEGAÇÃO ENTRE TELAS
  // (mantendo EXATAMENTE sua estrutura original)
  // ================================
  
  window.avançarParaDados = function() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;

    if (!nome || !email) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    document.getElementById('ctnLoginAluno1').style.display = 'none';
    document.getElementById('ctnLoginAluno2').style.display = 'block';
  };

  window.voltarParaEtapa1 = function() {
    document.getElementById('ctnLoginAluno1').style.display = 'block';
    document.getElementById('ctnLoginAluno2').style.display = 'none';
  };

  window.avançarParaInfoHome = function() {
    const tel = document.getElementById('tel').value;
    const nasc = document.getElementById('nasc').value;
    const cpf = document.getElementById('cpf').value;

    if (!tel || !nasc || !cpf) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    document.getElementById('ctnLoginAluno2').style.display = 'none';
    document.getElementById('ctnLoginAluno3').style.display = 'block';
  };

  window.voltarParaEtapa2 = function() {
    document.getElementById('ctnLoginAluno2').style.display = 'block';
    document.getElementById('ctnLoginAluno3').style.display = 'none';
  };

  window.avançarParaEndereco = function() {
    const quantComodos = document.getElementById('quantComodos').value;
    const rendaFam = document.getElementById('rendaFam').value;
    const falesobreVc = document.getElementById('falesobreVc').value;
    
    // Verifica se pelo menos um tipo de imóvel está selecionado
    const isProprioChecked = document.getElementById('proprio')?.checked;
    const isAlugadoChecked = document.getElementById('alugado')?.checked;
    
    const tipoImovelSelecionado = isProprioChecked || isAlugadoChecked;

    if (!quantComodos || !rendaFam || !falesobreVc || !tipoImovelSelecionado) {
      alert('Preencha todos os campos e selecione o tipo de imóvel.');
      return;
    }

    document.getElementById('ctnLoginAluno3').style.display = 'none';
    document.getElementById('ctnLoginAluno4').style.display = 'block';
  };

  window.voltarParaEtapa3 = function() {
    document.getElementById('ctnLoginAluno3').style.display = 'block';
    document.getElementById('ctnLoginAluno4').style.display = 'none';
  };

  window.avançarParaSenha = function() {
    const logradouro = document.getElementById('logradouro')?.value;
    const bairro = document.getElementById('bairro')?.value;
    const cidade = document.getElementById('cidade')?.value;
    const uf = document.getElementById('uf')?.value;

    if (!logradouro || !bairro || !uf || !cidade) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    document.getElementById('ctnLoginAluno4').style.display = 'none';
    document.getElementById('ctnLoginAluno5').style.display = 'block';
  };

  window.voltarParaEtapa4 = function() {
    document.getElementById('ctnLoginAluno4').style.display = 'block';
    document.getElementById('ctnLoginAluno5').style.display = 'none';
  };

  // ================================
  // BUSCA DE CEP (CORRIGIDA)
  // ================================
  
  const cepInput = document.getElementById('cep');
  const logradouroInput = document.getElementById('logradouro');
  const bairroInput = document.getElementById('bairro');
  const cidadeInput = document.getElementById('cidade');
  const ufInput = document.getElementById('uf');

  if (cepInput) {
    cepInput.addEventListener('blur', function() {
      let cep = (cepInput.value || '').toString().replace(/\D/g, '');

      // Limpa os campos ao sair do input
      if (logradouroInput) logradouroInput.value = '';
      if (bairroInput) bairroInput.value = '';
      if (cidadeInput) cidadeInput.value = '';
      if (ufInput) ufInput.value = '';

      if (cep.length !== 8) {
        alert('CEP inválido. Digite um CEP com 8 números.');
        return;
      }

      // URL CORRIGIDA (sem espaços!)
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
          if (!response.ok) throw new Error('Erro na resposta da API');
          return response.json();
        })
        .then(data => {
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

  // ================================
  // FINALIZAR CADASTRO (CORRIGIDA)
  // ================================
  
  window.finalizarCadastroHost = function() {
    // Obter valores com segurança
    const nome = document.getElementById('nome')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const tel = document.getElementById('tel')?.value || '';
    const nasc = document.getElementById('nasc')?.value || '';
    const cpf = document.getElementById('cpf')?.value || '';
    const senha = document.getElementById('senha')?.value || '';
    const estadoCivil = document.getElementById('estadoCiv')?.value || '';
    const quantComodos = document.getElementById('quantComodos')?.value || '';
    const rendaFam = document.getElementById('rendaFam')?.value || '';
    const falesobreVc = document.getElementById('falesobreVc')?.value || '';
    const confirmNovaSenha = document.getElementById('confirmNovaSenha')?.value || '';

    // Verifica tipo de imóvel
    let tipoImovel = '';
    if (document.getElementById('proprio')?.checked) tipoImovel = 'proprio';
    else if (document.getElementById('alugado')?.checked) tipoImovel = 'alugado';

    // Validação de senha
    if (!senha || !confirmNovaSenha) {
      alert("Por favor, preencha todos os campos de senha.");
      return;
    }

    if (senha !== confirmNovaSenha) {
      alert("A confirmação da senha não corresponde à nova senha!");
      return;
    }

    // Validação de tipo de imóvel
    if (!tipoImovel) {
      alert("Por favor, selecione o tipo de imóvel (próprio ou alugado).");
      return;
    }

    // 2. Criar um objeto com os dados
    const dadosUsuarioHost = {
      nome: nome,
      email: email,
      tel: tel,
      nasc: nasc,
      cpf: cpf,
      senha: senha,
      estadoCivil: estadoCivil,
      quantComodos: quantComodos,
      rendaFam: rendaFam,
      tipoImovel: tipoImovel,
      falesobreVc: falesobreVc,
      logradouro: logradouroInput?.value || '',
      bairro: bairroInput?.value || '',
      cidade: cidadeInput?.value || '',
      uf: ufInput?.value || '',
      tipo: 'host'
    };

    // 3. Salvar no localStorage
    localStorage.setItem('usuarioPerfilHost', JSON.stringify(dadosUsuarioHost));

    console.log('Cadastro finalizado:');
    alert('Cadastro realizado com sucesso!');

    // Atualiza o header (marca usuário como logado) ANTES de redirecionar
    if (typeof atualizarHeaderAposCadastro === 'function') {
      atualizarHeaderAposCadastro('host'); // IMPORTANTE: passar 'host' como parâmetro
    } else {
      // Fallback caso a função não exista
      localStorage.setItem('usuarioLogado', 'true');
      localStorage.setItem('tipoUsuario', 'host');
    }

    // Redireciona para a página inicial
    window.location.href = 'home.html';
  };

  // ================================
  // MOSTRAR/OCULTAR SENHA
  // ================================
  
  window.mostrarSenha = function() {
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
  };

  window.mostrarSenha2 = function() {
    const senhaInput = document.getElementById('confirmNovaSenha');
    const botao = document.getElementById('botao-senha2');

    if (!senhaInput || !botao) {
      console.error('❌ Elementos #confirmNovaSenha ou #botao-senha2 não encontrados!');
      return;
    }

    const isPassword = senhaInput.type === 'password';
    senhaInput.type = isPassword ? 'text' : 'password';

    botao.classList.toggle('mostrando', isPassword);
    botao.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
  };
  
  console.log("cadastroHost.js inicializado com sucesso");
});