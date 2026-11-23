const turma = [];
const form = document.querySelector("#form-aluno");
const campoNome = form.elements.namedItem("nome");
const campoNota = form.elements.namedItem("nota");
const busca = document.querySelector("#busca");
const listaAlunos = document.querySelector("#lista-alunos");
const mensagemEstado = document.querySelector("#mensagem-estado");
const notaMinima = 6;

function limparErro(campo) {
  const grupo = campo.closest(".campo");
  const mensagem = document.querySelector(`#erro-${campo.name}`);

  grupo.classList.remove("campo-invalido");
  campo.removeAttribute("aria-invalid");
  mensagem.textContent = "";
}

function mostrarErro(campo, texto) {
  const grupo = campo.closest(".campo");
  const mensagem = document.querySelector(`#erro-${campo.name}`);

  grupo.classList.add("campo-invalido");
  campo.setAttribute("aria-invalid", "true");
  mensagem.textContent = texto;
}

function criarCelula(texto, classe) {
  const celula = document.createElement("td");
  celula.textContent = texto;

  if (classe) {
    celula.className = classe;
  }

  return celula;
}

function mostrarTurma(alunos) {
  listaAlunos.replaceChildren();

  if (alunos.length === 0) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");
    const temBusca = busca.value.trim() !== "";

    linha.className = "linha-vazia";
    celula.colSpan = 3;
    celula.textContent = temBusca
      ? "Nenhum aluno encontrado para essa busca."
      : "Nenhum aluno cadastrado ainda.";
    linha.append(celula);
    listaAlunos.append(linha);
    return;
  }

  for (const aluno of alunos) {
    const linha = document.createElement("tr");
    const aprovado = aluno.media >= notaMinima;

    linha.append(
      criarCelula(aluno.nome),
      criarCelula(aluno.media.toFixed(1)),
      criarCelula(
        aprovado ? "Aprovado" : "Reprovado",
        aprovado ? "resultado-aprovado" : "resultado-reprovado"
      )
    );
    listaAlunos.append(linha);
  }
}

function filtrarTurma() {
  const termo = busca.value.trim().toLocaleLowerCase("pt-BR");
  const alunosFiltrados = turma.filter((aluno) =>
    aluno.nome.toLocaleLowerCase("pt-BR").includes(termo)
  );

  mostrarTurma(alunosFiltrados);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  limparErro(campoNome);
  limparErro(campoNota);

  const nome = campoNome.value.trim();
  const textoNota = campoNota.value.trim();
  const nota = Number(textoNota);
  let primeiroCampoComErro = null;

  if (nome.length < 3) {
    mostrarErro(campoNome, "Digite um nome com pelo menos 3 caracteres.");
    primeiroCampoComErro = campoNome;
  }

  if (
    textoNota === "" ||
    !Number.isFinite(nota) ||
    nota < 0 ||
    nota > 10
  ) {
    mostrarErro(campoNota, "Informe uma nota válida entre 0 e 10.");
    primeiroCampoComErro = primeiroCampoComErro || campoNota;
  }

  if (primeiroCampoComErro) {
    primeiroCampoComErro.focus();
    mensagemEstado.textContent = "Confira os campos destacados.";
    return;
  }

  turma.push({ nome, media: nota });
  form.reset();
  busca.value = "";
  filtrarTurma();
  mensagemEstado.textContent = `${nome} foi cadastrado com sucesso.`;
  campoNome.focus();
});

busca.addEventListener("input", filtrarTurma);

busca.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    busca.value = "";
    filtrarTurma();
  }
});

mostrarTurma(turma);
