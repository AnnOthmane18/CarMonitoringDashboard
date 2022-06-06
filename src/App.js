import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1>test1</h1>
      <h1>test12</h1>
    <BrowserRouter>
       <Routes>
         <Route path="/">
            <Route index element={<Home/>}/>
            <Route path="login" element={<Login/>}/>
         </Route>
       </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
