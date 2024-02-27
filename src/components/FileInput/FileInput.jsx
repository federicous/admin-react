import { useState, useEffect } from "react";
// import Button from '@mui/icons-material/Button';
import { Box, Button, CardMedia } from "@mui/material";
import GetAppIcon from "@mui/icons-material/AddPhotoAlternate";
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
        accept="image/*"
        type="file"
        id="select-image"
        style={{ display: "none" }}
        onChange={(e) => setSelectedImage(e.target.files[0])}
        name="image"
      />
      <label htmlFor="select-image">
        <Button
          startIcon={<GetAppIcon />}
          variant="contained"
          color="primary"
          component="span"
          fullWidth
        >
          Selecionar Imagen
        </Button>
      </label>
      {(imageUrl && selectedImage) ? (
        <>
          <Box mt={2} textAlign="center">
            <div>Vista previa:</div>
            <img src={imageUrl} alt={selectedImage.name} height="100px" />
          </Box>
        </>
      ) : (
        <>
          <Box mt={2} textAlign="center">
            <div>Imagen actual:</div>
            <img
              src={`${config.SERVER}/images/promocion/${img ? img : "sin_imagen.jpg"}`}
              alt="imagen-actual"
              height="100px"
            />
          </Box>
        </>
      )}
    </>
  );
};

export default FileInput;
