import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "./i18n";
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { setupStore } from './store/store';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const store = setupStore();
console.log('Initial state: ', store.getState())

store.subscribe(() => {
  console.log('State after dispatch: ', store.getState())

  //test
  //window.localStorage.setItem('token', store.getState().authReducer.token ?? '')
})

root.render(
  <Provider store={store}>
    {/* <BrowserRouter basename='/'> */}
    <BrowserRouter >
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
