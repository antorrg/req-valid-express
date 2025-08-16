#!/usr/bin/env node
import {buildSchema } from "./helpers/createSchema/index.js"


async function main() {
  console.log("Welcome to the schematic builder!");
 buildSchema();
}

main();