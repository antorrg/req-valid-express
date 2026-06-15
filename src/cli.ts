#!/usr/bin/env node
import {buildSchema } from "./core/createSchema/index.js"


async function main() {
  console.log("Welcome to the schematic builder!");
 buildSchema();
}

main();