# Código - Click Vacinas

> Aplicação web do Click Vacinas, construída com front-end unificado, API local simulada e fluxos integrados para acompanhamento vacinal.

## Visão da aplicação

A pasta `codigo` concentra a versão funcional do Click Vacinas. Ela reúne a interface, a lógica da aplicação, os dados simulados e as configurações necessárias para representar o produto em funcionamento.

O sistema foi estruturado para evitar telas soltas, arquivos duplicados e módulos separados por integrante. A experiência final roda como uma aplicação única, com navegação controlada por JavaScript e dados persistidos em uma base local.

A proposta técnica é simples e objetiva: entregar uma solução web capaz de conectar campanhas, avisos, vacinas, registros e postos de saúde em uma jornada coerente para o usuário.

## Estrutura da pasta

```text
codigo/
  db/
    db.json
  public/
    index.html
    styles.css
    app.js
  index.js
  package.json
  README.md
```

## Organização do front-end

O front-end foi consolidado em três arquivos principais dentro de `public`.

| Arquivo | Função |
| --- | --- |
| `index.html` | Define a estrutura das telas, formulários, tabelas, cards, menus, modais e áreas de conteúdo. |
| `styles.css` | Controla identidade visual, responsividade, espaçamentos, estados de botões, cards, navegação e adaptação mobile. |
| `app.js` | Concentra autenticação, estado da aplicação, rotas internas, renderização dinâmica, validações e comunicação com a API local. |

Essa escolha reduz fragmentação e facilita a leitura do fluxo completo da aplicação. O avaliador consegue entender a estrutura sem precisar procurar páginas espalhadas pelo projeto.

## Camada de dados

O arquivo `db/db.json` simula a base de dados do sistema. Ele é usado pelo JSON Server para expor rotas REST locais e persistir as alterações feitas pela interface.

| Coleção | Responsabilidade |
| --- | --- |
| `usuarios` | Armazena usuários, credenciais de teste e informações básicas de perfil. |
| `campanhas` | Mantém campanhas de vacinação com período, público-alvo e status. |
| `alertas` | Registra avisos/notificações e controla o estado de leitura. |
| `vacinas` | Representa a carteira vacinal, status de conclusão e próximas doses. |
| `registros` | Guarda o histórico de vacinas concluídas por usuário. |
| `postos_saude` | Lista unidades de atendimento, endereços e horários. |

## Modelo de navegação

A aplicação utiliza navegação interna por seções. Em vez de abrir várias páginas HTML, o JavaScript alterna as áreas visíveis da interface conforme a rota selecionada e o tipo de usuário autenticado.

Rotas principais:

- `home`
- `campaigns`
- `admin`
- `vaccination`
- `posts`
- `alerts`

Essa abordagem mantém a experiência fluida e permite que os dados carregados sejam reaproveitados entre as telas.

## Perfis de uso

### Usuário comum

O usuário comum tem acesso apenas às jornadas de consulta e acompanhamento. Ele pode:

- visualizar campanhas ativas;
- acompanhar o progresso vacinal;
- consultar histórico de doses;
- concluir vacinas pendentes;
- verificar próximas doses;
- acessar avisos e notificações;
- marcar avisos como lidos ou não lidos;
- excluir avisos da central;
- consultar postos de saúde.

### Administrador

O administrador possui acesso a recursos de manutenção dos dados exibidos no sistema. Ele pode:

- cadastrar, editar e excluir campanhas;
- cadastrar, editar e excluir avisos;
- cadastrar, editar e excluir vacinas;
- atualizar informações usadas na experiência do usuário comum.

A separação de perfis evita que ações administrativas apareçam para usuários comuns e reforça a lógica de permissões da aplicação.

## Fluxos implementados

### Campanhas

O módulo de campanhas separa consulta e administração. Usuários comuns visualizam campanhas ativas, enquanto o administrador gerencia a base completa de campanhas.

### Vacinação

A carteira vacinal apresenta progresso, status das vacinas, próximas doses e histórico. Quando uma vacina é concluída, a aplicação registra automaticamente a data no histórico do usuário.

### Avisos

A central de avisos controla leitura, exclusão e contador de notificações. O número exibido no sininho considera apenas avisos não lidos, evitando contagem inflada por notificações já vistas.

### Postos

A área de postos organiza unidades de atendimento com nome, endereço, horário e mapa incorporado, ajudando o usuário a encontrar rapidamente onde buscar atendimento.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| HTML5 | Estrutura da interface. |
| CSS3 | Estilo visual, responsividade e estados de componentes. |
| JavaScript | Regras de negócio, renderização, eventos e integração. |
| Bootstrap 5 | Base visual para componentes e responsividade. |
| Bootstrap Icons | Ícones de navegação, status e ações. |
| JSON Server | API REST local a partir do arquivo `db.json`. |
| Node.js | Ambiente de execução do servidor local. |

## Decisões técnicas

- Aplicação centralizada em um único HTML.
- CSS unificado para manter identidade visual consistente.
- JavaScript responsável pelo estado e pelas telas.
- Dados persistidos em coleções separadas por domínio.
- Rotas relativas para comunicação com a API local.
- Interface adaptada para desktop e mobile.
- Painel administrativo separado da experiência do usuário comum.
- Histórico vacinal vinculado à ação de concluir vacina.
- Notificações calculadas com base no estado real de leitura.

## Pontos de qualidade

- Fluxos completos e conectados entre si.
- Estrutura clara para avaliação do código.
- Baixa duplicação de telas e arquivos.
- Separação entre dados, interface e comportamento.
- Formulários com validação antes de salvar dados.
- Atualização visual imediata após ações do usuário.
- Uso de estruturas de dados consistentes para representar o domínio.

## Relação com a entrega final

Esta pasta representa a aplicação executável do projeto. A documentação e os materiais de apoio ficam fora dela, enquanto o código permanece concentrado nos arquivos necessários para demonstrar o produto funcionando.

Essa separação ajuda a manter o repositório organizado:

- `codigo` concentra a aplicação;
- `docs` concentra a documentação;
- `templates` guarda materiais de apoio da disciplina.
