import { NextApiRequest, NextApiResponse } from 'next'
import * as dfd from "danfojs-node";
import {createRouter} from 'next-connect';
import multer from 'multer';
import axios from 'axios';
import fs from "fs";
import path from 'path';

interface ProcessedForm {
    colNames: string[],
    // options: string[],
    // nameColumn: string,
    // orderColumn: string,
    // choiceColumns: string[],
}

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

const processCsv = async (csvPath: string) : Promise<string[]> => {
    const processedForm = {} as ProcessedForm;
    const df = await dfd.readCSV(csvPath);
    // processedForm.colNames = df.columns
    // processedForm.options = df.unique()
    console.log(df.columns)
    return df.columns;
}

const processRequest = async (req: NextApiRequest) => {
//   const form = formidable({ });
//     console.log("TEST")
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//         console.log("Error", err)
//     //   next(err);
//       return;
//     }
//     else {
//         console.log("C")
//     }
//     console.log("B", fields, files)
//     return {fields: files}
//   });
// const form = formidable({ });
// form.uploadDir = "./upload";
// form.keepExtensions = true;
// form.parse(req, (err, fields, files) => {
//   console.log("A", err, fields, files);
//   return {fields:files}
// });

}

// reference: https://betterprogramming.pub/upload-files-to-next-js-with-api-routes-839ce9f28430

export interface MulterFile {
  key: string
  path: string
  mimetype: string
  originalname: string
  size: number
  filename: string
}

const upload = multer({
    storage: multer.diskStorage({
        destination: "./public/uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
          cb(null, `${file.originalname.replace(".csv", "")}-${uniqueSuffix}.csv`)
        },
    }),
})
const uploadMiddleware = upload.single("file")

const apiRoute = createRouter<NextApiRequest, NextApiResponse>();

apiRoute.use(uploadMiddleware).post(async (req: NextApiRequest & { file: MulterFile }, res) => {
  // console.log("B", req.file.filename)
  const colNames = await processCsv(req.file.path)
  return res.status(200).json( {colNames: JSON.stringify(colNames), fileName: req.file.filename} );
});

export default apiRoute.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).end("Something broke!")
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page not found")
  }
});

export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };
  