import { render, screen } from '@testing-library/react';
import App from './App';
jest.mock('./components/Main/Main',()=>()=> <div>Aplicación administrativa</div>);
test('mounts the administrative application entrypoint',()=>{
 render(<App/>);
 expect(screen.getByText('Aplicación administrativa')).toBeInTheDocument();
});
