import * as React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import RemoveIcon from '@mui/icons-material/Remove';
import { Tooltip, IconButton, Link, Modal, Typography, Box, Backdrop, CircularProgress } from '@mui/material/';
import ApiQuery from "../utils/apiQuery/apiQuery";

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
  const { hasFocus, value, trending } = props;
  const buttonElement = React.useRef(null);
  const rippleRef = React.useRef(null);

  const [estado, setEstado] = React.useState(false)
  const [paginaWeb, setPaginaWeb] = React.useState("")
  const [openModal, setOpenModal] = React.useState(false);
  const [testReport, setTestReport] = React.useState("");
  const [openConsola, setOpenConsola] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleClose = () => {
    setOpen(false);
  };

  function buscarId(value) {    
    setOpen(true);
    apiQuery
      // .get(`/api/comandos/smarthost/smarthostLogs?from=${from}&to=${to}&buscar=${buscar}`)
      .get(`/api/comandos/smarthost/smarthostId?buscar_id=${value}`)
      .then((respuesta) => {
        // setBorrado(respuesta);
        setTestReport(respuesta.mensaje)
        setOpen(false);
        setOpenModal(true)
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
              <Modal
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
                </Modal>

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