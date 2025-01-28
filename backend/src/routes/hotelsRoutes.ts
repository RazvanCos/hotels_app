
import { Connection } from 'mysql2/promise';
import { organizationRoutes } from './organization/organizations';
import { seasonRoutes } from './seasons/seasons';
import { roomTypesRoutes } from './roomTypes/roomTypes';
import { ratePlansRoutes } from './ratePlans/ratePlans';
import { pricesRoutes } from './prices/prices';

export const hotelsRoutes = async (app: any, db: Connection) => {
    await organizationRoutes(app, db);
    await seasonRoutes(app, db);
    await roomTypesRoutes(app, db);
    await ratePlansRoutes(app, db);
    await pricesRoutes(app, db);
}

