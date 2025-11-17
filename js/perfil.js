// Função de mudar senha

function mudarSenha(){
    const senha = document.getElementById("senha");
    if (!senha) return;

    // salva estado/estilo original uma vez
    if (!senha.dataset._saved) {
      senha.dataset._origDisabled = String(senha.disabled);
      senha.dataset._origReadOnly = String(senha.readOnly);
      senha.dataset._origStyle = senha.style.cssText || '';
      senha.dataset._origClass = senha.className || '';
      senha.dataset._saved = 'true';
    }

    // Reativa edição
    senha.disabled = false;
    senha.readOnly = false;
    senha.classList.remove('disabled');
    senha.focus();

    // evita múltiplos listeners
    if (senha.dataset._enterListenerAttached === 'true') return;

    const onEnter = (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        // restaura estado e estilo originais
        senha.disabled = senha.dataset._origDisabled === 'true';
        senha.readOnly = senha.dataset._origReadOnly === 'true';
        senha.style.cssText = senha.dataset._origStyle || '';
        senha.className = senha.dataset._origClass || '';

        // remove listener e limpa flags para parar de rodar
        senha.removeEventListener('keydown', onEnter);
        delete senha.dataset._enterListenerAttached;
        delete senha.dataset._saved;
        delete senha.dataset._origDisabled;
        delete senha.dataset._origReadOnly;
        delete senha.dataset._origStyle;
        delete senha.dataset._origClass;
      }
    };

    senha.addEventListener('keydown', onEnter);
    senha.dataset._enterListenerAttached = 'true';
}

// Função de mudar e-mail

function mudarEmail() {
  const email = document.getElementById("email-acesso");
    if (!email) return;

    // salva estado/estilo original uma vez
    if (!email.dataset._saved) {
      email.dataset._origDisabled = String(email.disabled);
      email.dataset._origReadOnly = String(email.readOnly);
      email.dataset._origStyle = email.style.cssText || '';
      email.dataset._origClass = email.className || '';
      email.dataset._saved = 'true';
    }

    // Reativa edição
    email.disabled = false;
    email.readOnly = false;
    email.classList.remove('disabled');
    email.focus();

    // evita múltiplos listeners
    if (email.dataset._enterListenerAttached === 'true') return;

    const onEnter = (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        // restaura estado e estilo originais
        email.disabled = email.dataset._origDisabled === 'true';
        email.readOnly = email.dataset._origReadOnly === 'true';
        email.style.cssText = email.dataset._origStyle || '';
        email.className = email.dataset._origClass || '';

        // remove listener e limpa flags para parar de rodar
        email.removeEventListener('keydown', onEnter);
        delete email.dataset._enterListenerAttached;
        delete email.dataset._saved;
        delete email.dataset._origDisabled;
        delete email.dataset._origReadOnly;
        delete email.dataset._origStyle;
        delete email.dataset._origClass;
      }
    };

    email.addEventListener('keydown', onEnter);
    email.dataset._enterListenerAttached = 'true';
}

// --- Função de Máscara de Telefone (Formatação Automática) ---
function formatarTelefone(event) {
    let input = event.target;
    // 1. Remove tudo que não for dígito
    input.value = input.value.replace(/\D/g, "");
    
    // 2. Aplica a máscara para o formato (DD) 9XXXX-YYYY
    let value = input.value;
    if (value.length > 0) {
        value = "(" + value;
    }
    if (value.length > 3) {
        value = value.slice(0, 3) + ") " + value.slice(3);
    }
    // Ajuste o ponto do traço: 
    // Para 9 dígitos (ex: (11) 1234-5678) use 9
    // Para 10 dígitos (ex: (11) 91234-5678) use 10
    if (value.length > 10) { 
        value = value.slice(0, 10) + "-" + value.slice(10);
    }
    if (value.length > 15) { // Limita o tamanho final (ex: (11) 91234-5678 tem 15 caracteres)
        value = value.slice(0, 15);
    }
    input.value = value;
}


// --- Função Principal para Habilitar Edição ---
function mudarTele(){
    const tele = document.getElementById("tele-acesso");
    if (!tele) return;

    // salva estado/estilo original uma vez (sua lógica)
    if (!tele.dataset._saved) {
      tele.dataset._origDisabled = String(tele.disabled);
      tele.dataset._origReadOnly = String(tele.readOnly);
      tele.dataset._origStyle = tele.style.cssText || '';
      tele.dataset._origClass = tele.className || '';
      tele.dataset._saved = 'true';
    }

    // Reativa edição
    tele.disabled = false;
    tele.readOnly = false;
    tele.focus();

    // ADICIONA o ouvinte de evento 'input' para a máscara funcionar enquanto digita
    tele.addEventListener('input', formatarTelefone);

    // evita múltiplos listeners (sua lógica)
    if (tele.dataset._enterListenerAttached === 'true') return;

    const onEnter = (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        
        // REMOVE o ouvinte da máscara quando o usuário pressiona Enter (finaliza a edição)
        tele.removeEventListener('input', formatarTelefone); 

        // restaura estado e estilo originais (sua lógica)
        tele.disabled = tele.dataset._origDisabled === 'true';
        tele.readOnly = tele.dataset._origReadOnly === 'true';
        tele.style.cssText = tele.dataset._origStyle || '';
        tele.className = tele.dataset._origClass || '';

        // remove listener e limpa flags para parar de rodar (sua lógica)
        tele.removeEventListener('keydown', onEnter);
        delete tele.dataset._enterListenerAttached;
        delete tele.dataset._saved;
        // ... apagar o resto das flags dataset se quiser
      }
    };

    tele.addEventListener('keydown', onEnter);
    tele.dataset._enterListenerAttached = 'true';
}

// Variáveis dos radio dentro dos inputs de genero
const masc = document.getElementById('masc');
const fem = document.getElementById('fem');
const outro = document.getElementById('outro');
const prefiroN = document.getElementById('prefiroN');

// Variáveis da div com o input das rádio e a label
const mascInput = document.getElementById('mascInput');
const femInput = document.getElementById('femInput');
const outroInput = document.getElementById('outroInput');
const prefiroNInput = document.getElementById('prefiroNInput');

// Variavéis dos outros inputs 
const nasc = document.getElementById('nasc');
const nome = document.getElementById('nome');
const sobrenome = document.getElementById('sobrenome');
const cpf = document.getElementById('cpf');

function verificarRadio() {
  const containers = [
    { radio: masc, container: mascInput },
    { radio: fem, container: femInput },
    { radio: outro, container: outroInput },
    { radio: prefiroN, container: prefiroNInput }
  ];

  // Esconde todos
  containers.forEach(({ container }) => {
    if (container) container.style.display = 'none';
  });

  // Mostra só o que está checked (se houver)
  const selecionado = containers.find(({ radio }) => radio && radio.checked);
  if (selecionado && selecionado.container) {
    selecionado.container.style.display = ''; // ou 'flex'
  }
}

verificarRadio()

// Função de alterar todos os dados pessoais

function alterarPesso() {
  const camposTexto = [
    document.getElementById('nome'),
    document.getElementById('sobrenome'),
    document.getElementById('nasc'),
    document.getElementById('cpf')
  ];

  const radios = [
    document.getElementById('masc'),
    document.getElementById('fem'),
    document.getElementById('outro'),
    document.getElementById('prefiroN')
  ];

  const containersGenero = [
    document.getElementById('mascInput'),
    document.getElementById('femInput'),
    document.getElementById('outroInput'),
    document.getElementById('prefiroNInput')
  ];

  if (!camposTexto.every(el => el) || !radios.every(el => el) || !containersGenero.every(el => el)) {
    console.warn('Elementos faltando');
    return;
  }

  // Salvar estado original dos campos de texto
  camposTexto.forEach(campo => {
    if (!campo.dataset._saved) {
      campo.dataset._origDisabled = String(campo.disabled);
      campo.dataset._origReadOnly = String(campo.readOnly);
      campo.dataset._origStyle = campo.style.cssText || '';
      campo.dataset._origClass = campo.className || '';
      campo.dataset._saved = 'true';
    }
  });

  // Habilitar campos de texto
  camposTexto.forEach(campo => {
    campo.disabled = false;
    campo.readOnly = false;
    campo.classList.remove('disabled');
  });

  // Mostrar todos os containers de gênero
  containersGenero.forEach(container => {
    container.style.display = ''; // ou 'flex'
  });

  // === LÓGICA SEGURA DE DESELEÇÃO PARA RADIOS ===
  // Remover listeners antigos (evitar duplicação)
  radios.forEach(radio => {
    if (radio._onClickHandler) {
      radio.removeEventListener('click', radio._onClickHandler);
    }
  });

  // Criar novo handler
  let ultimoSelecionado = null;

  const handleClick = (e) => {
    const clicado = e.target;

    if (ultimoSelecionado === clicado && clicado.checked) {
      // Desmarca todos
      radios.forEach(r => r.checked = false);
      ultimoSelecionado = null;
    } else {
      ultimoSelecionado = clicado;
    }
    verificarRadio(); // atualiza a visibilidade imediatamente
  };

  // Aplicar o listener a todos os rádios
  radios.forEach(radio => {
    radio.disabled = false;
    radio._onClickHandler = handleClick;
    radio.addEventListener('click', handleClick);
  });

  // === FINALIZAR EDIÇÃO COM ENTER EM QUALQUER CAMPO ===
  const finalizarEdicao = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault();

      // Remover listeners
      [...camposTexto, ...radios].forEach(el => {
        el.removeEventListener('keydown', finalizarEdicao);
        if (el._onClickHandler) {
          el.removeEventListener('click', el._onClickHandler);
          delete el._onClickHandler;
        }
      });

      // Restaurar campos de texto
      camposTexto.forEach(campo => {
        campo.disabled = campo.dataset._origDisabled === 'true';
        campo.readOnly = campo.dataset._origReadOnly === 'true';
        campo.style.cssText = campo.dataset._origStyle || '';
        campo.className = campo.dataset._origClass || '';

        delete campo.dataset._saved;
        delete campo.dataset._origDisabled;
        delete campo.dataset._origReadOnly;
        delete campo.dataset._origStyle;
        delete campo.dataset._origClass;
      });

      // Atualizar visibilidade dos gêneros com o estado FINAL
      verificarRadio();

      // Remover listener global (segurança)
      document.removeEventListener('keydown', finalizarEdicao);
    }
  };

  // Adicionar listener de Enter em todos os campos editáveis
  [...camposTexto, ...radios].forEach(campo => {
    campo.addEventListener('keydown', finalizarEdicao);
  });

  camposTexto[0]?.focus();
}