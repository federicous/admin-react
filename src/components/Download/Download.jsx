import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/GetApp";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ApiQuery from "../utils/apiQuery/apiQuery";
let apiQuery = new ApiQuery();

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function InteractiveList() {
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [listas, setListas] = React.useState([]);
  const [borrado, setBorrado] = React.useState("")

  React.useEffect(() => {
    apiQuery.get(`/descargas/lista`).then((respuesta) => {
      setListas(respuesta);
    });
  }, [borrado]);

  function deleteFile(item) {
    apiQuery
      .delete(`/descargas/lista/${item}`)
      .then((respuesta) => {
	setBorrado(respuesta)
      })
      .catch((error) => {
        error = new Error();
      });
  }

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Listas para descargar
          </Typography>
          <Demo>
            <List dense={false}>
              {listas.map((item) => (
                <ListItem
                  key={item}
                  button
                  onClick={() => deleteFile(item)}
                  secondaryAction={
                    <Button variant="outlined" startIcon={<DeleteIcon />}>
                      Eliminar
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FileIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item}
                    //     secondary={secondary ? "Secondary text" : null}
                  />
                </ListItem>
              ))}
            </List>
          </Demo>
        </Grid>
      </Grid>
      <Button variant="contained" startIcon={<AddIcon />}>
        Agregar
      </Button>
    </Box>
  );
}
