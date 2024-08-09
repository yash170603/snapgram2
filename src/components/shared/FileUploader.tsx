import   { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};
const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {


  const [fileUrl, setFileUrl] = useState(mediaUrl);


  const [file, setFile] = useState<File[]>([]);


  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });


  return (

    <div
      {...getRootProps()}
      className="flex  flex-center flex-col bg-dark-3 rounde-xl cursor-pointer  "
    >
      <input {...getInputProps()} className="cursor-pointer" />


      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p>Click or drag photo to upload</p>
        </>
      ) 
      
      : (
        <div className="file_uploader-box">
          <img src="assets/icons/file-upload.svg" width={96} height={77} />

          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here or click to select photos
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG,PNG,JPG</p>
        </div>
      )}



    </div>
  );
};

export default FileUploader;
