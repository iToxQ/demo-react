import { FC } from 'react';
import { Link } from 'react-router-dom';
import AppRouter from './components/AppRouter';

const App: FC = () => {
    return (
        <div className="App">
            <AppRouter />
        </div>
    );
}

export default App;