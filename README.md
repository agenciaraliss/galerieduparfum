# Galerie Du Parfum · Nuvemshop (tema Rio)

Código da loja galerieduparfum.com.br, da Agência Raliss.

## Arquivos
- js/gdp-pix.js: preço Pix lendo o % do painel (substitui o Pix fixo em 5%).
- js/gdp-painel.js: itens que seguem o painel (item novo de menu, busca /search/, logo, ano, barra opcional). Não esconde nada.

## Como usar na Nuvemshop
No campo de rodapé, depois dos scripts que já existem, colar:

    <script src="https://cdn.jsdelivr.net/gh/agenciaraliss/galerieduparfum@main/js/gdp-pix.js" defer></script>
    <script src="https://cdn.jsdelivr.net/gh/agenciaraliss/galerieduparfum@main/js/gdp-painel.js" defer></script>

O jsDelivr guarda cache de @main por até 12 horas. Para valer na hora, criar uma tag (ex.: v1.0.1) e usar @v1.0.1 na URL.

## Ainda fixo no código (não segue o painel)
Categorias de aroma (ordem dos slides), WhatsApp, redes sociais e links dos submenus.
