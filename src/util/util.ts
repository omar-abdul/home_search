import { Knex } from "knex";
export const convertToSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const tableExists = async (
  knex: Knex,
  tname: string
): Promise<Boolean> => knex.schema.hasTable(tname);

export const genRandomId = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(Date.now().toString(36) + Math.random().toString(36).slice(2)),
      1
    );
  });
};
