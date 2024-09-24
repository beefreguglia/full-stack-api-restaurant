import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { knex } from '@/database/knex';
import { AppError } from '@/utils/AppError';

class TableSessionsController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const sessions = await knex<TableSessionsRepository>("tables_sessions")
        .orderBy("closed_at")

      return response.json(sessions);
    } catch (error) {
      next(error);
    }
  }
  
  async open(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id:z.number(),
      });

      const { table_id } = bodySchema.parse(request.body);

      const table = await knex<TableRepository>("tables")
        .where({ id: table_id })
        .first();

      if(!table) {
        throw new AppError("Table not found.")
      }
      
      const session = await knex<TableSessionsRepository>("tables_sessions")
        .where({ table_id })
        .orderBy("opened_at", "desc")
        .first();
      
      if (session && !session.closed_at) {
        throw new AppError("This table is already open");
      }

      await knex<TableSessionsRepository>("tables_sessions")
        .insert({ table_id });
      
      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  async close(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "Id must be a number." })
        .parse(request.params.id);

      const session = await knex<TableSessionsRepository>("tables_sessions")
        .where({ id })
        .first()

      if(!session) {
        throw new AppError("Session table not found.")
      }

      if(session.closed_at) {
        throw new AppError("This session table is already closed.")
      }

      await knex<TableSessionsRepository>("tables_sessions")
        .update({ closed_at: knex.fn.now() })
        .where({ id });
      
      return response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { TableSessionsController }