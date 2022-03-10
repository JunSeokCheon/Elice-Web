import './App.css';
import {createContext, useContext} from 'react';
const themeDefault = {
  border:'10px solid blue'
}
const themeContext = createContext(themeDefault);
function App() {
  const theme = useContext(themeContext);
  return (
    <themeContext.Provider value={{border:'10px dotted yellow'}}>
      <div style={{border:theme.border}}>
        <h1>Root</h1>
        <Child1></Child1>
      </div>
    </themeContext.Provider>
  );
}
function Child1(props){
  const theme = useContext(themeContext);
  return (
    <div style={{border:theme.border}}>
      <h1>1</h1>
      <themeContext.Provider value={{border:'10px dashed green'}}>
        <Child2></Child2>
      </themeContext.Provider>
    </div>
  )
}
function Child2(props){
  return (
    <div>
      <h1>2</h1>
      <Child3></Child3>
    </div>
  )
}
function Child3(props){
  const theme = useContext(themeContext);
  return (
    <div style={{border:theme.border}}>
      <h1>3</h1>
    </div>
  )
}
export default App;