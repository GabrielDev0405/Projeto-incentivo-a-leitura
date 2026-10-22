// ===== Elementos da página =====
const form = document.getElementById("form-meta");
const resultado = document.getElementById("resultado");
const campoMinutos = document.getElementById("minutos");
const saidaMinutos = document.getElementById("saida-minutos");

// ===== Constantes da regra de negócio =====
const PAGINAS_POR_MINUTO = 0.7;   // ritmo médio de leitura
const PAGINAS_POR_LIVRO = 250;    // tamanho médio de um livro

// As chaves precisam ser IDÊNTICAS aos "value" do <select> no HTML
const sugestoes = {
    romance: "Experimente ler historias cativantes de amor jovem.",
    fantasia: "Tente çer uma série de fantasia, onde cada volume puxa o próximo ou ficções impactantes",
    hq: "Tente começar por HQs e Mangás,  visto que são leituras de ritimo mais rapido",
    suspense: "Pense em narrativas que te prendam pelo suspense no ar",
    terror: "Se você gosta de filmes de terror dê uma chance a livros, podem ser tão assustadores quanto",
    "nao-ficcao": "Escolha uma biografia de alguem que você admira e gostaria de se inspirar",
};

// Evita que o que o usuário digita seja interpretado como HTML
function escaparHTML(texto) 
{
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// ===== Atualiza o "20 min" enquanto o usuário arrasta a barra =====
campoMinutos.addEventListener("input", () => {
  saidaMinutos.textContent = `${campoMinutos.value} min`;
});

// ===== Envio do formulário =====
form.addEventListener("submit", (evento) => {
  evento.preventDefault(); // impede a página de recarregar

  // 1) Captura dos dados
  const nome = escaparHTML(document.getElementById("nome").value.trim());
  const email = escaparHTML(document.getElementById("email").value.trim());
  const idade = Number(document.getElementById("idade").value);
  const livrosLidos = Number(document.getElementById("livros").value);
  const minutos = Number(campoMinutos.value);
  const genero = document.getElementById("genero").value;
  const formato = document.querySelector('input[name="formato"]:checked').value;
  const querDicas = document.getElementById("aceite").checked;

  // 2) Cálculos
  const paginasPorDia = Math.round(minutos * PAGINAS_POR_MINUTO);
  const livrosPorAno = Math.round((minutos * 365 * PAGINAS_POR_MINUTO) / PAGINAS_POR_LIVRO);

  // 3) Regra de negócio: perfil do leitor (condicional)
  let perfil;
  if (livrosLidos === 0) {
    perfil = "Leitor em potencial";
  } else if (livrosLidos <= 3) {
    perfil = "Leitor iniciante";
  } else {
    perfil = "Leitor frequente";
  }

  // 4) Mais regras: operadores lógicos, comparação e ternário
  const publicoJovem = idade >= 10 && idade <= 29;
  const metaMaior = livrosPorAno > livrosLidos;

  const mensagemMeta = metaMaior
    ? `Sua meta de ${livrosPorAno} livros por ano supera os ${livrosLidos} que você leu no último ano. Bom desafio!`
    : `Você já lê ${livrosLidos} livros por ano, mais do que a meta de ${livrosPorAno}. Continue assim!`;

  const dicaFormato = formato === "digital"
    ? "No formato digital, desative as notificações enquanto lê."
    : "No formato físico, deixe o livro sempre à vista ou na mochila.";

  const avisoIdade = !publicoJovem
    ? "<p><em>Este site é voltado a jovens de 10 a 29 anos, mas a meta vale para qualquer pessoa.</em></p>"
    : "";

  const avisoEmail = querDicas
    ? `<p>As dicas de leitura serão enviadas para <strong>${email}</strong>.</p>`
    : "";

  // 5) Exibição dinâmica no DOM com Template Literals
  resultado.innerHTML = `
    <div class="resultado-card ${livrosLidos === 0 ? "alerta" : ""}">
      <h3>${nome}, seu perfil é: ${perfil}</h3>
      <p>Lendo ${minutos} minutos por dia, você lê cerca de <strong>${paginasPorDia} páginas por dia</strong> e pode chegar a <strong>${livrosPorAno} livros por ano</strong>.</p>
      <p>${mensagemMeta}</p>
      <p>${sugestoes[genero]}</p>
      <p>${dicaFormato}</p>
      ${avisoEmail}
      ${avisoIdade}
    </div>`;

  console.log(`Perfil de ${nome}: ${perfil} | meta: ${livrosPorAno} livros/ano`);
});

// ===== Botão "Limpar" =====
form.addEventListener("reset", () => {
  resultado.innerHTML = "";
  saidaMinutos.textContent = "20 min";
});