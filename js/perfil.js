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

// Função de mudar telefone

function mudarTele(){
  const tele = document.getElementById("tele");
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
  if(masc.checked){
    femInput.style.display = 'none';
    outroInput.style.display = 'none';
    prefiroNInput.style.display = 'none';
  }else if(fem.checked){
    mascInput.style.display = 'none';
    outroInput.style.display = 'none';
    prefiroNInput.style.display = 'none';
  }else if(outro.checked){
    femInput.style.display = 'none';
    mascInput.style.display = 'none';
    prefiroNInput.style.display = 'none';
  }else if(prefiroN.checked){
    femInput.style.display = 'none';
    outroInput.style.display = 'none';
    mascInput.style.display = 'none';
  }
}

verificarRadio()

function 