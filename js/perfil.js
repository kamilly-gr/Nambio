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