import {publicUserRow,userUpdate} from './userPayload';
test('public row never keeps a legacy hash',()=>expect(publicUserRow({_id:'1',email:'x',password:'$2b$hash'})).toEqual({_id:'1',email:'x',password:''}));
test('approval and seller change preserve password by omission',()=>expect(userUpdate({_id:'1',name:'A',email:'x',enable:'on',vendedor:'V',password:''},{_id:'1',name:'A',email:'x',enable:'off',vendedor:'W'})).toEqual({_id:'1',email:'x',enable:'on',vendedor:'V'}));
test('only explicit new plaintext is sent',()=>{expect(userUpdate({_id:'1',email:'x',password:'NewPassword!'}).password).toBe('NewPassword!');for(const password of ['$2b$hash','********',{},' '])expect(()=>userUpdate({_id:'1',password})).toThrow();});
