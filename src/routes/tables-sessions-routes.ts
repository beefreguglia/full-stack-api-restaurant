import { Router } from 'express';

import { TableSessionsController } from '@/controllers/tables-sessions-controller';

const tablesSessionsRoutes = Router();
const tablesSessionsController = new TableSessionsController();

tablesSessionsRoutes.get("/", tablesSessionsController.index);
tablesSessionsRoutes.post("/", tablesSessionsController.open);
tablesSessionsRoutes.patch("/:id", tablesSessionsController.close);

export { tablesSessionsRoutes }