# Click Vacinas

> Plataforma web para centralizar campanhas, avisos, carteira vacinal, histórico de doses e postos de saúde em uma experiência simples, responsiva e integrada.


## Visão geral

O **Click Vacinas** foi criado para tornar o acompanhamento vacinal mais claro, rápido e acessível. A aplicação reúne informações que normalmente ficam espalhadas entre cartão físico, comunicados, sites públicos e lembretes pessoais, oferecendo uma visão única para o usuário acompanhar sua situação vacinal.

A solução organiza a jornada em cinco frentes principais:

- campanhas de vacinação ativas;
- carteira vacinal com progresso;
- histórico de doses;
- avisos e notificações;
- postos de saúde com horário e localização.

O produto também possui uma área administrativa para manter campanhas, avisos e vacinas atualizados sem alterar manualmente a interface.

## Problema

O controle de vacinação ainda depende, em muitos casos, de registros físicos, memória do usuário e informações dispersas. Isso aumenta o risco de atraso em doses, perda de histórico, baixa adesão a campanhas e dificuldade para encontrar informações confiáveis no momento certo.

O Click Vacinas atua nesse cenário como uma camada de organização e acesso rápido, ajudando o usuário a entender:

- quais campanhas estão disponíveis;
- quais vacinas já foram concluídas;
- quais doses ainda estão pendentes;
- quais avisos exigem atenção;
- onde buscar atendimento.

## Solução

A aplicação entrega uma experiência integrada para dois perfis de uso:

| Perfil | Experiência entregue |
| --- | --- |
| Usuário comum | Acompanha campanhas ativas, carteira vacinal, histórico, avisos e postos de saúde. |
| Administrador | Gerencia campanhas, avisos/notificações e vacinas exibidas no sistema. |

Essa separação evita que usuários comuns acessem telas administrativas e mantém o foco de cada jornada: consulta e acompanhamento para o cidadão; manutenção de dados para o administrador.

## Principais recursos

### Campanhas

- Listagem de campanhas ativas para usuários comuns.
- Cadastro, edição e exclusão de campanhas no painel administrativo.
- Exibição de período, público-alvo e status da campanha.

### Carteira vacinal

- Visualização de vacinas concluídas e pendentes.
- Barra de progresso vacinal.
- Cadastro administrativo de novas vacinas.
- Registro de vacinas futuras sem obrigatoriedade de data de aplicação.
- Atualização automática do histórico ao concluir uma vacina.

### Avisos e notificações

- Central de avisos com leitura detalhada.
- Marcação de notificações como lidas ou não lidas.
- Exclusão de avisos por usuários comuns e administradores.
- Contador no sininho baseado apenas em notificações não lidas.

### Postos de saúde

- Consulta de unidades disponíveis.
- Exibição de endereço e horário de atendimento.
- Apoio visual com mapa incorporado.

### Experiência e interface

- Layout responsivo para desktop e mobile.
- Navegação unificada em uma única aplicação.
- Separação visual entre usuário comum e administrador.
- Interface limpa, com cards, tabelas e formulários consistentes.

## Arquitetura

O projeto foi consolidado em uma estrutura simples e direta, com front-end unificado e dados persistidos em uma API local simulada.

```text
plf-es-2026-1-ti1-7641100-vacinacao/
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
  docs/
    files/
    images/
    README.md
  templates/
  CITATION.cff
  LICENSE
  README.md
```

## Tecnologias

| Tecnologia | Uso no projeto |
| --- | --- |
| HTML5 | Estrutura das telas e elementos da interface. |
| CSS3 | Identidade visual, responsividade e componentes. |
| JavaScript | Regras de negócio, navegação, eventos e integração com a API. |
| Bootstrap 5 | Apoio visual para layout, botões, formulários e modais. |
| Bootstrap Icons | Ícones da interface e ações do usuário. |
| JSON Server | Simulação de API REST local com persistência em JSON. |
| Node.js | Ambiente de execução do servidor local. |
| GitHub | Versionamento, organização e entrega do repositório. |

## Dados principais

A base local utiliza coleções em JSON para representar as entidades centrais do sistema:

| Coleção | Finalidade |
| --- | --- |
| `usuarios` | Contas de usuários comuns e administradores. |
| `campanhas` | Campanhas de vacinação e seus períodos. |
| `alertas` | Avisos, notificações e estados de leitura. |
| `vacinas` | Carteira vacinal, status e próximas doses. |
| `registros` | Histórico de doses concluídas por usuário. |
| `postos_saude` | Unidades de atendimento e horários. |

## Qualidade da entrega

- Código-fonte organizado em arquivos centrais.
- Interface responsiva e padronizada.
- Funcionalidades conectadas entre si.
- Separação de permissões entre administrador e usuário comum.
- Uso de estruturas de dados para campanhas, avisos, vacinas, registros e postos.
- Atualização dinâmica da interface com base no estado dos dados.
- Documentação complementar na pasta `docs`.

## Equipe

- Sávio José Salomão Ferreira da Silva
- Maryanne Ilha da Luz
- Samuel Oliveira Paulinelli Resende
- Paulo Cirelli Fideles de Melo
- Arthur Willian Gonçalves Domingues

## Orientação

- Luiz Henrique da Costa Silva
- Cleiton Silva Tavares
- Danilo de Quadros Maia Filho
