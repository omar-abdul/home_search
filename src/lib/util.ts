import { Knex } from "knex";
import crypto from "crypto";
import { NextFunction } from "express";
export const convertToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};
export const convertToCamelCase = function (str: any) {
  if (typeof str === "object") {
    const replace = (s: string) =>
      s.replace(/([_][a-z])/g, (letters) =>
        letters.toUpperCase().replace("_", "")
      );
    return Object.fromEntries(
      Object.entries(str).map(([k, v]) => [replace(k), v])
    );
  }
};

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

export const getCryptoRandomId = (size: number) => {
  return crypto.randomBytes(size | 16).toString("hex");
};

export const responseObject = ({
  err = null,
  data = null,
}: {
  err?: any;
  data?: any;
}) => {
  return { err, data };
};

export const passErrorToNext = async (
  fn: Promise<any>,
  nextFn: NextFunction
) => {
  return Promise.resolve(fn)
    .then((val) => {
      if (val?.err && val?.err instanceof Error) throw val.err;
      return val.data;
    })
    .catch(nextFn);
};
