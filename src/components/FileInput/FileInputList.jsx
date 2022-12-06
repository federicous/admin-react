import { useState, useEffect } from "react";
// import Button from '@mui/icons-material/Button';
import { Box, Button, CardMedia } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { config } from "../../config/config";

const FileInput = ({ img }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <>
      <input
        accept="*/*"
        type="file"
        id="select-image"
        style={{ display: "none" }}
        onChange={(e) => setSelectedImage(e.target.files[0])}
        name="lista"
      />
      <label htmlFor="select-image">
        <Button
          startIcon={<UploadFileIcon />}
          variant="contained"
          color="primary"
          component="span"
          fullWidth
        >
          Selecionar Lista
        </Button>
      </label>
      {imageUrl && selectedImage ? (
        <>
          <Box mt={2} textAlign="center">
            <div>Lista:</div>
            <div>{selectedImage.name}</div>
          </Box>
        </>
      ) : (
        <>
        </>
      )}
      {/* <CardMedia
        component="img"
        image={`${config.SERVER}/images/${img ? img : "sin_imagen.jpg"}`}
        sx={{
          height: { xs: "150px", sm: "200px" },
          width: "100%",
          objectFit: "cover",
        }}
        alt="sin imagen"
      /> */}
    </>
  );
};

export default FileInput;
