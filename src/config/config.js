// import axios from "axios";
// require('dotenv').config();
let SERVIDOR_NODE= process.env.REACT_APP_SERVER;

// const configuration = {
// 	method: "get",
// 	url: "https://www.dolarsi.com/api/api.php?type=valoresprincipales",
//       };
//     let DOLAR_OFICIAL_VENTA;
//       // make the API call
//       axios(configuration)
// 	.then((result) => {
// 		DOLAR_OFICIAL_VENTA =[...result.data].filter((tipo)=> tipo.casa.nombre == "Dolar Oficial")[0].casa.venta
// 		// console.log(DOLAR_OFICIAL_VENTA);
		
// 	})
// 	.catch((error) => {
// 	  error = new Error();
// 	})


export const config = {
	// SERVER_LOCAL: `http://localhost:8088`,
	SERVER: SERVIDOR_NODE || `http://app.distribuidorabrmtools.com:8088`,
	DOLAR: 147,
}

// export const config = async () => {
// 	// SERVER_LOCAL: `http://localhost:8088`,
// 	try {
// 		let result = await axios(configuration)
// 		DOLAR_OFICIAL_VENTA =[...result.data].filter((tipo)=> tipo.casa.nombre == "Dolar Oficial")[0].casa.venta
// 			console.log(DOLAR_OFICIAL_VENTA);
	
// 		return(
// 			{
// 				SERVER: SERVIDOR_NODE || `http://app.distribuidorabrmtools.com:8088`,
// 				DOLAR: DOLAR_OFICIAL_VENTA ? parseFloat(DOLAR_OFICIAL_VENTA) : 232,
// 			}
// 		)
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

// async function config() {
// 	const result = await axios(configuration)
// 	let DOLAR_OFICIAL_VENTA =[...result.data].filter((tipo)=> tipo.casa.nombre == "Dolar Oficial")[0].casa.venta
// 	return {
// 		SERVER: SERVIDOR_NODE || `http://app.distribuidorabrmtools.com:8088`,
// 		DOLAR: DOLAR_OFICIAL_VENTA ? parseFloat(DOLAR_OFICIAL_VENTA) : 232,
// 	}
//     }
    
//     module.exports = config()