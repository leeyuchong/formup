import { NextApiRequest, NextApiResponse } from 'next'
import * as dfd from "danfojs-node";
import nc from 'next-connect';
import multer from 'multer';
import axios from 'axios';

interface ProcessedForm {
    columnNames: string[],
    options: string[],
}

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

const processCsv = (csv: File) : ProcessedForm => {
    const retVal = {} as ProcessedForm;
    // const df = dfd.readCSV(csv);
    return retVal;
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



const upload = multer({
    storage: multer.diskStorage({
        destination: "./public/uploads",
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
})

const apiRoute = nc<NextApiRequest, NextApiResponse>({
  // Handle any other HTTP method
  onNoMatch: (req, res) => {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const uploadMiddleware = upload.array('file')

apiRoute.use(uploadMiddleware)


// Process a POST request
apiRoute.post((req, res) => {
  res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };
  
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//     // Calling our pure function using the `res` object, it will add the `set-cookie` header
//     // Return the `set-cookie` header so we can display it in the browser and show that it works!
//     // await processRequest(req);
//     res.status(200).json(await processRequest(req))
//   }
  
//   export default handler
  