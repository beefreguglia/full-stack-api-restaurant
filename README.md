# API Restaurant

> Esse projeto é referente ao desenvolvimento de uma API para restaurante. Ele foi desenvolvido durante o curso Full-Stack da rocketseat.

## 💻 Tecnologias

- Node.Js
- Typescript
- Express
- Tsx
- Sqlite3
- Knex
- Zod

## Features

### Products

- [x] Deve ser possível visualizar todos os produtos;
- [x] Deve ser possível criar um novo produto;
- [x] Deve ser possível atualizar um produto pelo id;
- [x] Deve ser possível deletar um produto pelo id;

### Tables

- [x] Deve ser possível visualizar todos as mesas;

### Tables Sessions

- [x] Deve ser possível visualizar todos as sessões;
- [x] Deve ser possível abrir uma nova sessão;
- [x] Deve ser possível fechar uma sessão pelo id;

### Orders

- [x] Deve ser possível visualizar todos os pedidos de uma sessão específica;
- [x] Deve ser possível criar um novo pedido;
- [x] Deve ser possível visualizar o resumo pedido;

## RBAC

Roles & permissions.

### Roles

- Usuário

### Tabela de permissões

|                     | Usuário |
| ------------------- | ------- |
| List Product        | ✅      |
| Create Product      | ✅      |
| Update Product      | ✅      |
| Delete Product      | ✅      |
| List Table          | ✅      |
| List Table Sessions | ✅      |
| Open Table Session  | ✅      |
| Close Table Session | ✅      |
| List Order          | ✅      |
| Create Order        | ✅      |
| Resume Order        | ✅      |

> ✅ = allowed
> ❌ = not allowed
> ⚠️ = allowed w/ conditions

#### Condições
- Deve ser possível buscar produtos por parte parte do nome caso seja enviado na query
- A lista de sessões deve ser retornada de forma decrescente
- Os pedidos devem retornar o total (price * quantity)
