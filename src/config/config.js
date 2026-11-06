const server=process.env.REACT_APP_SERVER || (process.env.NODE_ENV==='production'?'':'http://localhost:8088');
if(!server)throw Error('REACT_APP_SERVER es obligatoria en producción');
if(process.env.NODE_ENV==='production'){const u=new URL(server);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||u.pathname!=='/')throw Error('REACT_APP_SERVER debe ser un origen HTTPS exacto');}
export const config={SERVER:server,DOLAR:147,ADMINISTRADOR:process.env.REACT_APP_ADMIN};
