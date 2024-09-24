import { knex } from '@/database/knex';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction} from 'express';
import { z } from 'zod';

class OrdersController {
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
}

export { OrdersController }