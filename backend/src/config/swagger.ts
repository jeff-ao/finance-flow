import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Flow API",
      version: "1.0.0",
      description:
        "API de gerenciamento financeiro com controle de transações, recorrências e categorias",
      contact: {
        name: "Finance Flow Team",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de Desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Autenticação JWT - Use o token retornado no login",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Mensagem de erro",
            },
            details: {
              type: "array",
              description: "Detalhes do erro (presente em erros de validação)",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    description: "Campo que causou o erro",
                  },
                  message: {
                    type: "string",
                    description: "Mensagem de erro do campo",
                  },
                },
              },
            },
            stack: {
              type: "string",
              description:
                "Stack trace (apenas em ambiente de desenvolvimento)",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID do usuário",
            },
            uuid: {
              type: "string",
              format: "uuid",
              description: "UUID do usuário",
            },
            name: {
              type: "string",
              description: "Nome do usuário",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email do usuário",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data de atualização",
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID da categoria",
            },
            uuid: {
              type: "string",
              format: "uuid",
              description: "UUID da categoria",
            },
            name: {
              type: "string",
              description: "Nome da categoria",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data de atualização",
            },
          },
        },
        Frequency: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID da frequência",
            },
            title: {
              type: "string",
              description: "Nome da frequência",
              example: "Mensal",
            },
            intervalValue: {
              type: "integer",
              description: "Valor do intervalo",
              example: 1,
            },
            intervalUnit: {
              type: "string",
              description: "Unidade do intervalo",
              example: "meses",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data de atualização",
            },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID da transação",
            },
            uuid: {
              type: "string",
              format: "uuid",
              description: "UUID da transação",
            },
            title: {
              type: "string",
              description: "Título da transação",
            },
            value: {
              type: "number",
              format: "decimal",
              description: "Valor da transação",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Data da transação",
            },
            type: {
              type: "string",
              enum: ["INPUT", "OUTPUT"],
              description: "Tipo da transação",
            },
            status: {
              type: "string",
              enum: ["PENDING", "PAID"],
              description: "Status da transação",
            },
            installmentNumber: {
              type: "integer",
              description: "Número da parcela",
            },
            categoryId: {
              type: "integer",
              nullable: true,
              description: "ID da categoria",
            },
            userId: {
              type: "integer",
              description: "ID do usuário",
            },
            recurrenceId: {
              type: "integer",
              nullable: true,
              description: "ID da recorrência",
            },
            category: {
              $ref: "#/components/schemas/Category",
            },
            recurrence: {
              $ref: "#/components/schemas/Recurrence",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data de atualização",
            },
          },
        },
        Recurrence: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID da recorrência",
            },
            uuid: {
              type: "string",
              format: "uuid",
              description: "UUID da recorrência",
            },
            title: {
              type: "string",
              description: "Título da recorrência",
            },
            totalInstallments: {
              type: "integer",
              nullable: true,
              description: "Total de parcelas (null = infinito)",
            },
            startDate: {
              type: "string",
              format: "date-time",
              description: "Data de início",
            },
            active: {
              type: "boolean",
              description: "Se a recorrência está ativa",
            },
            type: {
              type: "string",
              enum: ["INPUT", "OUTPUT"],
              description: "Tipo da recorrência",
            },
            userId: {
              type: "integer",
              description: "ID do usuário",
            },
            categoryId: {
              type: "integer",
              nullable: true,
              description: "ID da categoria",
            },
            frequencyId: {
              type: "integer",
              description: "ID da frequência",
            },
            category: {
              $ref: "#/components/schemas/Category",
            },
            frequency: {
              $ref: "#/components/schemas/Frequency",
            },
            transactions: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Transaction",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data de atualização",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Token de autenticação não fornecido ou inválido",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              examples: {
                noToken: {
                  summary: "Token não fornecido",
                  value: {
                    error: "Token não fornecido",
                  },
                },
                invalidToken: {
                  summary: "Token inválido",
                  value: {
                    error: "Token inválido ou expirado",
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          description: "Erro de validação dos dados enviados",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                error: "Erro de validação",
                details: [
                  {
                    field: "email",
                    message: "Email inválido",
                  },
                  {
                    field: "password",
                    message: "A senha deve ter no mínimo 6 caracteres",
                  },
                ],
              },
            },
          },
        },
        NotFoundError: {
          description: "Recurso não encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                error: "Recurso não encontrado",
              },
            },
          },
        },
        InternalServerError: {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                error: "Erro interno do servidor",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Users",
        description: "Operações relacionadas a usuários",
      },
      {
        name: "Transactions",
        description: "Operações relacionadas a transações financeiras",
      },
      {
        name: "Recurrences",
        description: "Operações relacionadas a recorrências de transações",
      },
      {
        name: "Categories",
        description: "Operações relacionadas a categorias",
      },
      {
        name: "Frequencies",
        description: "Operações relacionadas a frequências de recorrências",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
