import * as React from 'react';
import Button from '@mui/material/Button';
import RemoveIcon from '@mui/icons-material/Remove';
import { Tooltip, IconButton, Link, Modal, Typography, Box, Backdrop, CircularProgress } from '@mui/material/';
import ApiQuery from "../utils/apiQuery/apiQuery";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import dayjs from "dayjs";
import "dayjs/locale/es";

let apiQuery = new ApiQuery();

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 400,
  // maxHeight: "400px",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'hidden'
};

function ChipCell(props) {
  const { hasFocus, value, trending, fecha, tipo} = props;
  const buttonElement = React.useRef(null);
  const rippleRef = React.useRef(null);

  const [estado, setEstado] = React.useState(false)
  const [paginaWeb, setPaginaWeb] = React.useState("")
  const [openModal, setOpenModal] = React.useState(false);
  const [testReport, setTestReport] = React.useState("");
  const [openConsola, setOpenConsola] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpenDialog(true);
    setScroll(scrollType);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (openDialog) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openDialog]);

  // const handleOpenModal = () => setOpenModal(true);
  // const handleCloseModal = () => setOpenModal(false);
  const handleClose = () => {
    setOpen(false);
  };

  function buscarId(value) {    
    setOpen(true);
    apiQuery
      // .get(`/api/comandos/smarthost/smarthostLogs?from=${from}&to=${to}&buscar=${buscar}`)
      .get(`/api/comandos/smarthost/smarthostId?buscar_id=${value}${fecha.format("YYYY-MM-DD")==dayjs().format("YYYY-MM-DD") ? "" : "&fecha=" + fecha.format()}${tipo ? "&tipo="+tipo : ""}`)
      .then((respuesta) => {
        // setBorrado(respuesta);
        setTestReport(respuesta.mensaje)
        setOpen(false);
        setOpenDialog(true)
      })
      .catch((error) => {
        error = new Error();
      });
  }

  let regex = /(https?:\/\/[^\s]+)/;
  
  function getLink(string) {
    return (string.match(regex) ? string.match(regex)[0] : "");
  }

  React.useLayoutEffect(() => {
    if (hasFocus) {
      const input = buttonElement.current.querySelector('input');
      input?.focus();
    } else if (rippleRef.current) {
      // Only available in @mui/material v5.4.1 or later
      rippleRef.current.stop({});
    }
  }, [hasFocus]);

  React.useEffect(() => {
    if (value) {
      console.log(value);
      setEstado(true)
      setPaginaWeb(getLink(`${value}`))
    }  
  }, [])  

  switch(estado) {
      case false :
        return (
          <>
        <RemoveIcon />
          </>
        );
    default:
      return (
        <>{ (`${value}` != "NOQUEUE") ? (
          <>
            {/* <Tooltip title={`${value}`} arrow > */}
              <Link onClick={()=>buscarId(value)} style={{textDecoration: "none", cursor: "pointer"}}>
                {`${value}`}
              </Link>
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
              >
                <DialogTitle id="scroll-dialog-title">{`ID: ${value}`}</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                  <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                  >
                    {/* {testReport} */}
                    <Typography variant="body2" gutterBottom style={{whiteSpace: 'pre-line'}} >
                      {testReport}
                    </Typography>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cerrar</Button>
                  {/* <Button onClick={handleCloseDialog}>Subscribe</Button> */}
                </DialogActions>
              </Dialog>
              {/* <Modal
                  open={openModal}
                  onClose={handleCloseModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      {`Transacción: ${value}`}
                    </Typography>
                    <Box component="p">
                      <Typography id="modal-modal-description" sx={{ mt: 2 }} variant="body2" gutterBottom style={{whiteSpace: 'pre-line'}} >
                      {testReport}
                      </Typography>
                    </Box>
                  </Box>
                </Modal> */}

                <Backdrop
                  sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={open}
                  onClick={handleClose}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
            {/* </Tooltip> */}
            </>
        ) : (
          `${value}`
        )
          }
        </>
      );
  }
}

export default ChipCell