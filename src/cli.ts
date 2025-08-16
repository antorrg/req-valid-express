#!/usr/bin/env node
import {buildSchema } from "./helpers/createSchema/index.js"


async function main() {
  console.log("¡Bienvenido al creador de esquemas!");
 buildSchema();
}

main();