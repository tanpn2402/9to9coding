import fs from 'fs';
import formidable from 'formidable';
import { isArray, forEach } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const urls: Array<string> = [];
    if (isArray(files.file)) {
      forEach(files.file, async file => {
        let result = await uploadFile(file);
        if (result.success) {
          urls.push(result.url ?? '');
        }
      });
    } else {
      let result = await uploadFile(files.file);
      if (result.success) {
        urls.push(result.url ?? '');
      }
    }
    return res.status(201).send(urls);
  });
};

const storeFileLocally = async (file: formidable.File) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./${file.originalFilename}`, data);
  fs.unlinkSync(file.filepath);
  return await new Promise<{ success: Boolean; error?: string; url?: string }>(resolve => {
    resolve({
      success: true,
      url: `cooming-soon`
    });
  });
};

const uploadFile = async (file: formidable.File) => {
  const data = fs.readFileSync(file.filepath);
  const storageRef = ref(storage, `files/${file.originalFilename}`);
  const uploadTask = uploadBytesResumable(storageRef, data);
  let result = await new Promise<{ success: Boolean; error?: string; url?: string }>(resolve => {
    uploadTask.on(
      'state_changed',
      snapshot => {
        // on prgress
      },
      error => {
        // error
        resolve({ success: false, error: error.message });
      },
      () => {
        // complete
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          resolve({ success: true, url: downloadURL });
        });
      }
    );
  });
  fs.unlinkSync(file.filepath);
  return result;
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  req.method === 'POST'
    ? post(req, res)
    : req.method === 'PUT'
    ? console.log('PUT')
    : req.method === 'DELETE'
    ? console.log('DELETE')
    : req.method === 'GET'
    ? console.log('GET')
    : res.status(404).send('');
};
