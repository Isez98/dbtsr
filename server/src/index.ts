import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PropertyRentalResolver } from "./resolvers/PropertyRental";
import { UserResolver } from "./resolvers/User";
import { DevelopmentsResolver } from "./resolvers/Developments";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";
import { PropertyRental } from "./entities/PropertyRental";
import { User } from "./entities/User";
import { Owner } from "./entities/Owner";
import { Rent } from "./entities/Rent";
import { Developments } from "./entities/Developments";
import { OwnerResolver } from "./resolvers/Owner";
//import { sendEmail } from "./utils/sendEmail";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "dbtsr",
    logging: true,
    synchronize: true,
    username: "postgres",
    password: "postgres",
    entities: [PropertyRental, User, Owner, Rent, Developments],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5, // Cookie will last 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // Cookie only works in https
      },
      saveUninitialized: false,
      secret: "qazxswedcvfrtgbnhy",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        PropertyRentalResolver,
        UserResolver,
        DevelopmentsResolver,
        OwnerResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
