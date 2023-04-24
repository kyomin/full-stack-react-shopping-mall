import fs from 'fs';
import { resolve } from 'path';

export enum DBField {
  PRODUCTS = 'products',
  CART = 'cart',
}

const basePath = resolve();

const filenames = {
  [DBField.PRODUCTS]: resolve(basePath, 'src/db/products.json'),
  [DBField.CART]: resolve(basePath, 'src/db/cart.json'),
};

export const readDB = (target: DBField) => {
  try {
    return JSON.parse(fs.readFileSync(filenames[target], 'utf-8'));
  } catch (err) {
    console.error(err);
  }
};

export const writeDB = (target: DBField, data: any) => {
  try {
    fs.writeFileSync(filenames[target], JSON.stringify(data, null, ' '));
  } catch (err) {
    console.error(err);
  }
};
