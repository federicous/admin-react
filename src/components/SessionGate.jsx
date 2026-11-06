import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {config} from '../config/config';
import Login from './Login/Login';
import {currentToken,cookieIdentity,assertCookies,isAdministrator,expireIfCurrent,installSessionTransport,SESSION_EVENT} from './sharedSession';
installSessionTransport();
export default function SessionGate({children,requireAdmin=false}) {
 const [status,setStatus]=useState('checking'),[error,setError]=useState('');
 useEffect(()=>{let cancelled=false;const token=currentToken(),identity=cookieIdentity();const changed=()=>{if(cookieIdentity()!==identity)window.location.reload();};const timer=setInterval(changed,1000);window.addEventListener('focus',changed);window.addEventListener(SESSION_EVENT,changed);
 const check=async()=>{try{assertCookies();if(!token){setStatus(requireAdmin?'anonymous':'ready');return;}const response=await axios({method:'get',url:config.SERVER+'/api/auth/session',withCredentials:true,headers:{Authorization:'Bearer '+token}});if(cancelled||cookieIdentity()!==identity)return;if(response.data?.authenticated!==true)throw Error('Sesión no confirmada');setStatus(requireAdmin&&!isAdministrator(response.data.user)?'forbidden':'ready');}catch(e){if(cancelled||cookieIdentity()!==identity)return;if(e.response?.status===401&&!e.response?.data?.code){expireIfCurrent(token);setStatus(requireAdmin?'anonymous':'ready');}else{setError(e.sessionConflict?'Hay cookies de sesión contradictorias. Cerrá la sesión compartida y volvé a ingresar.':'No se pudo validar la sesión. Recargá para reintentar.');setStatus('error');}}};check();return()=>{cancelled=true;clearInterval(timer);window.removeEventListener('focus',changed);window.removeEventListener(SESSION_EVENT,changed);};},[requireAdmin]);
 if(status==='checking')return <div role="status">Verificando sesión…</div>;
 if(status==='anonymous')return <Login/>;
 if(status==='forbidden')return <div role="alert">No tiene permisos para acceder al administrador.</div>;
 if(status==='error')return <div role="alert">{error}</div>;
 return <>{children}</>;
}
