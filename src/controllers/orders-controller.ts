import { knex } from '@/database/knex';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction} from 'express';
import { z } from 'zod';

class OrdersController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const table_session_id = z.string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "id must be a number."})
        .parse(request.params.table_session_id);

      const session = await knex<TableSessionsRepository>("tables_sessions")
        .where({ id: table_session_id })
        .first();

      if(!session) {
        throw new AppError("Session not found.");
      }

      const orders = await knex<OrderRepository>("orders")
        .select(
          "orders.id", 
          "orders.table_session_id", 
          "orders.product_id",
          "orders.price",
          "orders.quantity",
          "orders.created_at",
          "orders.updated_at",
          knex.raw("(orders.price * orders.quantity) AS total"),
          "products.name"
        )
        .join("products", "products.id", "orders.product_id")
        .where({ table_session_id })
        .orderBy("orders.created_at", "desc");

      return response.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        "table_session_id": z.number(),
        "product_id": z.number(),
        "quantity": z.number(),
      });

      const { product_id, quantity, table_session_id } = bodySchema.parse(request.body);

      const session = await knex<TableSessionsRepository>("tables_sessions")
        .select()
        .where({ id: table_session_id })
        .first();

      if(!session) {
        throw new AppError("Sessions table not found.");
      }

      if(session.closed_at) {
        throw new AppError("This table is closed.")
      }

      const product = await knex<ProductRepository>("products")
        .select()
        .where({ id: product_id })
        .first();

      if(!product) {
        throw new AppError("Product not found.")
      }

      await knex<OrderRepository>("orders").insert({
        table_session_id,
        product_id,
        quantity,
        price: product.price
      })

      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const table_session_id = z.string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "id must be a number."})
        .parse(request.params.table_session_id);

      const session = await knex<TableSessionsRepository>("tables_sessions")
        .where({ id: table_session_id })
        .first();

      if(!session) {
        throw new AppError("Session not found.");
      }

      const order = await knex<OrderRepository>("orders")
        .select(
          knex.raw("(SUM(orders.price * orders.quantity)) AS total"),
        )
        .where({ table_session_id })
        .first();

      return response.json(order);
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController }