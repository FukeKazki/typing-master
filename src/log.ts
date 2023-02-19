import { ansi } from "https://deno.land/x/cliffy@v0.25.7/ansi/ansi.ts";
import { colors } from "https://deno.land/x/cliffy@v0.25.7/ansi/colors.ts";

console.log(colors.bold.blue("hello"), colors.bold.gray("world"));
console.log(ansi.cursorUp(1).eraseLine() + colors.bold.blue("hellow"));
