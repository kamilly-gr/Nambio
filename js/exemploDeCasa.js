
document.addEventListener('DOMContentLoaded', function () {
            new Splide('#image-carousel', {
                type: 'loop',
                perPage: 1,
                autoplay: true,
                interval: 3000, // 3 segundos
                pauseOnHover: true,
                arrows: true,
                pagination: true,
            }).mount();
        });


        function confirmacao(){
            let conhecer = document.getElementById('conhecer-familia')
            let confirmacao = document.getElementById('COnfirmacao-tag')

            conhecer.style.display = 'none'

            confirmacao.style.display ='flex'
        }
        