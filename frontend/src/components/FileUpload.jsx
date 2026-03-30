import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const FileUpload = ({ onUpload, isUploading }) => {
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleUploadClick = () => {
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`glass-card p-12 rounded-2xl border-2 border-dashed transition-all duration-300 text-center cursor-pointer 
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-white/20 hover:border-primary/50'}
          ${isDragReject ? 'border-red-500 bg-red-500/5' : ''}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-surface flex items-center justify-center border border-white/10">
            {isDragActive ? (
              <Upload className="h-8 w-8 text-primary animate-bounce" />
            ) : (
              <File className="h-8 w-8 text-muted" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">
              {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
            </h3>
            <p className="text-muted text-sm px-4">
              Upload your PDF resume to get instant AI-powered feedback. Maximum file size is 5MB.
            </p>
          </div>
        </div>
      </div>

      {file && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col items-center"
        >
          <div className="flex items-center space-x-3 bg-surface border border-white/10 px-4 py-3 rounded-xl mb-4">
            <File className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
            <span className="text-xs text-muted">
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            {isUploading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Analyzing Resume...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Analyze Now - 1 Credit</span>
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
