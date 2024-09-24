import { Router } from 'express';

import { TableSessionsController } from '@/controllers/tables-sessions-controller';

const tablesSessionsRoutes = Router();
const tablesSessionsController = new TableSessionsController();

tablesSessionsRoutes.post("/", tablesSessionsController.create);

export { tablesSessionsRoutes }