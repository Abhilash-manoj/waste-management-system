const uploadWithErrorHandler = (req, res, next) => {
  const uploadMiddleware = upload.single("profilePicture"); 

  uploadMiddleware(req, res, (err) => {
    if (err) {
      
      console.error("---!! MULTER ERROR !! ---:", err);
      return res.status(500).json({ 
        message: "File upload failed. Check server logs.",
        error: err.message 
      });
    }
    
    next();
  });
};
export default uploadWithErrorHandler;