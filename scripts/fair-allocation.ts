import * as readline from 'readline';
import * as dfd from "danfojs-node";
import { DataFrame } from 'danfojs-node/dist/danfojs-base';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function selectName(cols: string[]) {
    var idx: number = 0;
    rl.question(`Which column has the names of the participants? ${cols}`, (answer: string) => {
        idx = Number(answer);
        rl.close();
      });
    return cols[idx];
}

function selectRandomOrderColumn(df: DataFrame) {
    var colName: string = "sort_index";
    rl.question("Is there a column that defines the picking order?", (answer: string) => {
      if (answer === "yes") {
        rl.question("Select the column", (answer: string) => {
          colName = df.axis.columns[answer];
        })
      }
      else {
        const randomArray: number[] = [];
        for (let i=0; i<df.shape[0]; i++) {
          randomArray.push(i);
        }
        shuffleArray(randomArray);
        df = df.addColumn("sort_index", randomArray);
      }
    });
    return df.sortValues(colName);
}

function confirmColsWithChoices(cols: string[]) {
  const retArr: string[] = [];
    rl.question(`Indicate columns with choices: ${cols}`, (answer: string) => {
      const choices = answer.split(" ").map(Number);
      for (var choice in choices) {
        retArr.push(cols[choice])
      }
    })
    return retArr;
}

function FairAllocation(fp: string) {
    const df = dfd.readCSV(fp)
    .then(dataframe => {
      const retArr: string[] = [];
      const cols: (string)[] = dataframe.axis.columns.map(String);
      rl.question(`Indicate columns with choices: ${cols}`, (answer: string) => {
        const choices = answer.split(" ").map(Number);
        for (var choice in choices) {
          retArr.push(cols[choice])
        }
      })
    }).then(dataframe => {
      
    })



    let arr = [[12, 34, 2.2, 2], [30, 30, 2.1, 7]]
    let df2 = new dfd.DataFrame(arr, {columns: ["A", "B", "C", "D"]})
    let x = df2.axis
    let y = x.columns
    // Read the file
    // Ask user the column for name
        // Do a fuzzy match on the column names 
    // Ask user about random order column
        // is there a column which specifies the order in alphanumeric order? 
        // Random order determined by program? 
    // Ask user the column for choices
    // Ask user to confirm the choices & limits
    // Make the passes
}

