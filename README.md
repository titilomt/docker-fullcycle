# CODEFLIX

## Requisitos

CodeFlix streaming de videos online 😎 FullCycle

- Assinatura do serviço pelo cliente
- Catálogo de videos para navegação
- Playback de vídeos (Player)
- Busca de texto no catálogo
- Processamento de encoding dos vídeos
- Administração do catálogo de vídeos (Processo de criação de vídeos)
- Administração do serviço de Assinatura
- Autenticação (Single singon - loga uma vez e ecoa por todo o ecosistema)

## Arquitetura do Projeto

- Arquitetura baseada em Microsserviços
- Tecnologia adequada para cada contexto, ex: "Golang para processar vídeos"
- Não existe uma única verdade na escolha das tecnologias
- Microsserviços podem ser substituido por outros com tecnologias diferentes
- Cada Microsserviço tem que ter seu próprio CI/CD

### API Gateway

- Acesso externo aos microsserviços através do ingresso do Kubernetes / Istio como API Gateway
- Único ponto de acesso direto as aplicações
- Controle de tráfego
- Rate limit
- Politicas de Retry

### Service Discover

- Não haverá a necessidade de trabalhar com um sistema de service de Discovery como "Consul"
- O projeto utilizará o Kubernetes para Orquestrar os containers, logo Service Discovery já faz parte do processo

### Escalabilidade

- Escalabilidade de forma horizontal (ao invés de melhorar a máquina, vamos colocar mais máquinas para rodar)
- Todos os Microsserviços trabalharão de forma Stateless (Isso significa que não vamos trabalhar pensando em cookies, sessions e etc)
- Quando utilizado upload de qualquer tipo de asset (videos, foto etc), o mesmo será armazenado em um Cloud Storage
- O processo de escala se dará no aumento na quantidade de PODs do kubernetes
- O processo de autoscaling também será utilizado através de um recurso HPA (Horizontal Pod Autoscaler)
- Todos os logs gerados serão persistidos em sistemas externos como Prometheus e Elasticsearch

## Eventos

- Grande parte da comunicação entre microsserviços será Assíncrona
- Cada Microsserviço possuirá sua própria Base de Dados
- Eventualmente os dados poderão ficar inconsistentes, desde que não haja prejuízo direto ao negócio

### Persistencia em Banco de Dados

- Duplicação de dados, eventuamente um microsserviço poderá persistir um dado que já existe em outro microsserviço em seu banco de dados.
- Essa Duplicação existe para deixar o microsserviço mais autônomo e preciso
- O microsserviço Duplicará apenas os dados necessários para seu contexto (ex: Ao cadastrar um video, temos uma infinidade de propriedades, porém ao listar este video no catálogo, não é necessário exibir todas as informações daquela mídia)

## Mensageria

- Como grande parte da comunicação entre os microsserviços é assíncrona, um sistema de mensageria é necessário
- Podemos escolher entre Apache Kafka ou RabbitMQ ferramentas gratuitas que atendem ao nosso projeto
- Usando essas ferramentas (Kafka ou RabbitMQ) evitamos assim o Lock-in de Clouds Providers, exemplo Amazom SQS e similares (pode acontecer uma falta de disponibilidade e causar um travamento nas filas usando sistemas Cloud)

## Resiliência e Self Healing

Resiliência: Como garantir que as coisas continuem funcionando mesmo que aconteça algum problema, evitar efeitos domino ou indisponibilidade de microsserviços

Self-healing: Capacidade do microsserviço recuperar após algum tipo de queda

- Para garantir resiliência caso um ou mais microsserviços fiquem fora do ar, as filas(Sistema de Mensageria) serão essenciais 
- Caso uma mensagem venha em um padrão não esperado para determinado microsserviço, o microsserviço poderá rejeitá-la e automaticamente a mesma poderá ser encaminhada para uma dead-letter queue (uma fila para mensagens rejeitadas) ex: "caso alguem suba um vídeo de formato errado, a mensagem não é perdida e sim rejeitada e cai em uma fila especifica para tratamento de erro"
- Pelo fato do Kubernetes e Istio possuirem recursos de Circuit Breaker e Liveness e Readiness probes
    - Circuit Breaker: é uma forma de self healing, entra em ação normalmente quando o recurso para o microsserviço fica muito pesado e acaba caindo por falta de memória ou algo do tipo (toda requisição que é enviada para um Microsserviço que por qualquer motivo, ficou indisponivel, ele responde as mensagens com um erro 500 até este serviço ficar ativo de novo e completar o circuito de microsserviços novamente)
    - Liveness e Readiness probes: O Kubernets "testa" os microsserviços de forma automática para garantir que o microsserviço está disponível (online), caso não esteja, automaticamente é criado ou reiniciado uma instância deste microsserviço

## Autenticação

- Serviço centralizado de identificação opensource: Keycloak
- OpenID Connect - retorna as informações de autenticação e um Token
- Customização do tema (ao entrar no sistema, fica indiferente para o consumidor que estaremos usando o Keycloak)
    - Utilização do crate-react-app com Keycloak 
- Compartilhamento de chave pública com os serviços para verificação de autenticidade dos Tokens
- Diversos tipos de ACL (Autorização de usuários)
- Flow de autenticação para Frontend e Backend
    - Frontend: Entrar com credenciais (Login/Signup)
    - Backend: Token para ter a autorização/permissão de Autenticação de Usuário

---

# Microsserviços

- Admin Catálogo de Vídeo (Backend)
- Admin Catálogo de Vídeos (Frontend)
- Encoder e Vídeo com Golang
- API do Catálogo (Backend)
- Aplicação do Catálogo (Frontend)
- Assinatura do Codeflix pelo Cliente
- Autenticação entre Microsserviços com Keycloak
- Comunicação assíncrona entre os Microsserviços com o Sistema de Mensageria
