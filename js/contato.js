function confirmacao() {
    let conhecer = document.getElementById('conhecer-familia')
    let confirmacao = document.getElementById('COnfirmacao-tag')
    let noti = document.getElementById('noti1', 'noti2')
    let relato = document.getElementById('relato')
    let email = document.getElementById('email')
    let nome = document.getElementById('nome')

    noti.checked = false
    relato.value = null
    email.value = null
    nome.value = null

    conhecer.style.display = 'none'

    confirmacao.style.display = 'flex'
}