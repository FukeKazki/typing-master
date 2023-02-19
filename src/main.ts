import { keypress, KeyPressEvent } from "cliffy/keypress";
import { HiraganaParser } from "hiragana-parser";
import outdent from "outdent";
import { Table } from "cliffy/table";
import { colors } from "https://deno.land/x/cliffy@v0.25.7/ansi/colors.ts";
import { ansi } from "https://deno.land/x/cliffy@v0.25.7/ansi/ansi.ts";
import { Select } from "https://deno.land/x/cliffy@v0.25.7/prompt/select.ts";
import { difference } from "https://deno.land/std@0.130.0/datetime/mod.ts";
const ROW_PROBLEMS = [
  "やっほー",
  "こんにちは",
  "ふっけだよ",
];

const success = colors.gray.bold;
const not = colors.blue.bold;

let correctKeyCount = 0;
let keyCount = 0;
let score = 0;
let started = new Date();

const displayLog = (first: string, second: string) => {
  const removeline = ansi.cursorUp(1).eraseLine();
  const spacer = "          ";
  if (first && second) {
    return console.log(removeline + spacer + success(first) + not(second));
  }
  if (first) {
    return console.log(removeline + spacer + success(first));
  }
  if (second) {
    return console.log(spacer + not(second));
  }
};

console.log(ansi.clearScreen());
console.log(outdent`
=======================================================================================
                                                                                       
                              ■                     ■                  ■         ■     
    ■            ■     ■     ■ ■  ■            ■    ■     ■■■■     ■ ■■■■■■      ■     
   ■■■■■        ■      ■     ■■   ■■           ■■■■■    ■■ ■  ■     ■■■■■■■      ■     
  ■■   ■       ■       ■   ■■           ■     ■    ■    ■  ■   ■      ■ ■        ■     
  ■■  ■      ■■■       ■■■■             ■    ■■   ■    ■   ■   ■  ■■■■■■■■■      ■■    
 ■  ■ ■     ■  ■       ■               ■     ■    ■    ■  ■    ■   ■ ■■■■■■     ■ ■    
     ■         ■       ■              ■          ■     ■  ■    ■   ■■■■■■■■     ■  ■   
    ■■         ■       ■            ■■          ■      ■  ■   ■    ■   ■       ■   ■■  
   ■■          ■        ■■■■■■    ■■           ■        ■■  ■■    ■ ■■■■■■■  ■■      ■ 
                                                                                       
=======================================================================================
                                create by @fukke0906
=======================================================================================
`);

const displayResult = () => {
  const diff = difference(new Date(), started);
  const table = new Table(
    ["正しく入力したキー数", correctKeyCount],
    ["平均キータイプ数", correctKeyCount / (diff?.seconds ?? 1)],
    ["ミスタイプ数", keyCount - correctKeyCount],
    ["合計スコア", score],
  ).header(["結果発表 [ふつう]", "スコア"]).border(true);
  console.log(ansi.clearScreen());
  table.render();
};

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log(ansi.cursorNextLine(2) + "");
  const _mode: string = await Select.prompt({
    message: "ゲームモード",
    options: [
      { name: "かんたん", value: "easy" },
      { name: "ふつう", value: "usual" },
      Select.separator("--------"),
      { name: "きろく", value: "log" },
    ],
  });
  console.log(ansi.clearScreen());
  started = new Date();
  for (const row of ROW_PROBLEMS) {
    const parser = new HiraganaParser({ hiraganas: row });
    const table = new Table([not(row)], [not(parser.notInputedRoma)]).indent(
      10,
    );
    table.render();

    for await (const event: KeyPressEvent of keypress()) {
      keyCount++;
      // 入力
      const success = parser.input(event.key);
      if (success) {
        correctKeyCount++;
      }
      displayLog(parser.inputedRoma, parser.notInputedRoma);
      if (event.ctrlKey && event.key === "c") {
        console.log("exit");
        break;
      }
      if (parser.isComplete()) {
        score += row.length;
        console.log(ansi.clearScreen());
        break;
      }
    }
  }
  displayResult();
}
