#!/usr/bin/env node
import watch from "node-watch";
import { execa } from "execa";
import tsconfig from "../tsconfig.json" assert { type: "json" };
import { dirname, join } from "node:path";

const outDir = tsconfig.compilerOptions.outDir;
let watcher = watch(join(dirname(__dirname), outDir), { recursive: true });

watcher.on("change", function (evt, name) {
    setTimeout(() => {
        execa("tspath", ["--projectPath", ".", "-f"]).stdout.pipe(process.stdout);
    }, 500);
});
