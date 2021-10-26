import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "project-liven"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === "test"
          ? "project-liven_test"
          : defaultOptions.database,
    })
  );
};
