# Documentação - Click Vacinas

> Materiais de produto, discovery, design e entrega que explicam a construção do Click Vacinas além do código-fonte.

## Visão da pasta

A pasta `docs` concentra os artefatos usados para registrar a evolução do Click Vacinas como solução digital. Ela complementa o código-fonte ao explicar o problema, o contexto de uso, as decisões de produto, os fluxos priorizados e os materiais visuais utilizados durante o desenvolvimento.

Enquanto a pasta `codigo` mostra a aplicação funcionando, esta pasta mostra o raciocínio que levou à solução final.

## Papel na entrega

O material de documentação serve como evidência de que a aplicação foi construída a partir de um problema real e não apenas como um conjunto de telas desconectadas. Ele apresenta a ligação entre:

- necessidade do usuário;
- proposta de valor;
- jornadas da aplicação;
- requisitos funcionais;
- decisões de interface;
- funcionalidades implementadas;
- materiais finais de avaliação.

Essa conexão é importante para demonstrar maturidade do projeto e coerência entre planejamento, desenvolvimento e entrega.

## Estrutura

```text
docs/
  files/
    processo-dt.pdf
  images/
    wireframe1.png
    wireframe2.png
    video.png
    exemplo-arquitetura.png
    exemplo-funcionalidade.png
    exemplo-kanban.png
    exemplo-persona.png
    exemplo-proposta-valor.png
    exemplo-userflow.png
    exemplo-wireframe.png
    exemplo-workflow.png
  README.md
```

## Conteúdo documentado

### Contexto do problema

O Click Vacinas parte da dificuldade de acompanhar informações de vacinação em diferentes canais. Cartões físicos, avisos isolados, datas de campanhas e consultas a postos nem sempre estão centralizados, o que pode gerar atraso em doses e perda de histórico.

A documentação registra esse contexto para deixar claro por que a aplicação foi criada e qual valor ela entrega ao usuário.

### Público e jornada

O projeto considera dois tipos principais de interação:

- o usuário comum, que precisa consultar, acompanhar e decidir rapidamente;
- o administrador, que mantém campanhas, avisos e vacinas atualizados.

Essa divisão aparece na aplicação final e também orienta a organização dos fluxos documentados.

### Product Discovery

Os materiais de discovery ajudam a demonstrar como o grupo compreendeu o problema antes de implementar a solução. Essa etapa sustenta as decisões sobre simplicidade da interface, centralização de informações e foco em jornadas curtas.

Entre os pontos analisados estão:

- dores relacionadas a esquecimento e perda de registros;
- dificuldade de encontrar campanhas relevantes;
- necessidade de consultar postos de saúde;
- importância de avisos claros;
- preferência por uma experiência direta e responsiva.

### Product Design

Os artefatos de design registram a transformação do problema em interface. Eles apoiam a definição das telas, dos fluxos e dos componentes usados na aplicação final.

Os materiais visuais ajudam a explicar:

- organização da navegação;
- hierarquia das informações;
- priorização de cards e ações rápidas;
- separação entre área comum e área administrativa;
- adaptação da experiência para diferentes tamanhos de tela.

### Implementação

A documentação também acompanha a solução entregue no código, conectando funcionalidades planejadas às telas implementadas.

As principais áreas representadas são:

- login e criação de conta;
- home integrada;
- campanhas ativas;
- painel administrativo;
- carteira vacinal;
- histórico de doses;
- central de avisos;
- consulta de postos.

## Materiais disponíveis

### `files`

Contém documentos complementares do processo, como materiais de design thinking e registros usados para embasar a documentação final.

### `images`

Reúne imagens de apoio, wireframes, exemplos visuais, fluxos e referências usadas para comunicar o projeto de forma mais clara.

As imagens não funcionam apenas como ilustração; elas ajudam a mostrar a evolução da solução, a intenção das telas e a organização da experiência.

## Relação com o produto final

A documentação acompanha o que foi realmente implementado na aplicação. O produto final possui:

- campanhas ativas para usuários comuns;
- painel administrativo para campanhas;
- painel administrativo para avisos;
- painel administrativo para vacinas;
- carteira vacinal com progresso;
- registro de conclusão no histórico;
- notificações com controle de leitura;
- contador de avisos não lidos;
- postos de saúde com mapa;
- layout responsivo e unificado.

Essa coerência entre documentação e aplicação evita que o projeto pareça dividido em entregas desconectadas.

## Critérios de avaliação contemplados

### Conjunto funcional

A documentação evidencia jornadas completas: entrar no sistema, consultar campanhas, acompanhar vacinação, concluir uma vacina, verificar histórico, ler avisos e consultar postos.

Também mostra que o painel administrativo interfere diretamente na experiência do usuário comum, fortalecendo a integração entre funcionalidades.

### Qualidade e complexidade

Os materiais destacam decisões que elevam a qualidade da entrega:

- uso de dados estruturados;
- controle de estados de leitura;
- cálculo de progresso vacinal;
- histórico vinculado à conclusão de vacina;
- separação de permissões;
- interface responsiva;
- organização de código e documentação.

## Padrão de organização

Esta pasta deve permanecer focada em documentação, imagens e materiais de apoio. Arquivos de código, dependências e dados executáveis pertencem à pasta `codigo`.

Essa separação mantém o repositório mais limpo e facilita a avaliação:

- `README.md` principal apresenta o projeto;
- `codigo/README.md` explica a aplicação;
- `docs/README.md` explica os materiais de documentação;
- `docs/images` concentra imagens e evidências visuais;
- `docs/files` guarda documentos complementares.

## Uso na apresentação

Os materiais desta pasta podem apoiar a apresentação final do projeto, principalmente ao explicar:

- o problema escolhido;
- a solução proposta;
- os fluxos do usuário;
- as funcionalidades entregues;
- a evolução visual do produto;
- a relação entre documentação e implementação.


