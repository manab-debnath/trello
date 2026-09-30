import { auth } from "./auth";

const ctx = await auth.$context;
const test = ctx.test;

export { test };
