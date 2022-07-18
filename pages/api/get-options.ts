import * as dfd from "danfojs-node";

export default function handler(req, res) {
    if (req.method === 'POST') {
      const df = dfd.readCSV(req.body.fileName)
      var uniqueOptions = new Set()
      req.body.colNames.forEach(col => {
        df[col].unique().values().forEach(val => {
            uniqueOptions.add(val)
        });
      });
      res.status(200).json(JSON.stringify(Array.from(uniqueOptions)));
    } 
  }