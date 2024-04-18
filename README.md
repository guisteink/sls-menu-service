# Menu Service

Este é um projeto serverless para fornecer um menu do dia e enviar mensagens para grupos em horários específicos.

## Pré-requisitos

Antes de começar, verifique se você possui o seguinte instalado em sua máquina:

- [Node.js](https://nodejs.org/) (preferencialmente na versão 12.x)
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/) instalado globalmente

## Instalação

1. **Clone este repositório:**

   ```bash
   git clone https://github.com/seu-usuario/menu-service.git
   ```

2. **Navegue até o diretório do projeto:**

   ```bash
   cd menu-service
   ```

3. **Instale as dependências:**

   ```bash
   npm install
   ```

## Configuração

Antes de implantar o serviço na AWS, você precisará configurar suas credenciais AWS localmente. Você pode fazer isso executando o seguinte comando e seguindo as instruções:

```bash
serverless config credentials --provider aws --key YOUR_KEY --secret YOUR_SECRET
```

Substitua `YOUR_KEY` e `YOUR_SECRET` pelas suas credenciais da AWS.

## Implantação

Para implantar o serviço na AWS, execute o seguinte comando:

```bash
serverless deploy
```

## Comandos Úteis

- **Implantação de uma função específica:**

  ```bash
  serverless deploy function --function functionName
  ```

- **Remoção do serviço:**

  ```bash
  serverless remove
  ```

- **Invocar função localmente:**

  ```bash
  serverless invoke local --function functionName
  ```

- **Visualizar logs da função na AWS:**

  ```bash
  serverless logs --function functionName
  ```

- **Obter informações sobre o serviço implantado:**

  ```bash
  serverless info
  ```

## Autor

[Guilherme Stein](mailto:guilherme.steink@gmail.com)
