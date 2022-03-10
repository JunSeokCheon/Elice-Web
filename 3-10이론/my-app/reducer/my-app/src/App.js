// import logo from './logo.svg';
// import './App.css';
// import {useState, useReducer} from 'react';

// function App() {
//   // const [count,setCount] = useState(0);
//   // function increase(){
//   //   setCount(count+1);
//   // }

//   // 회계직원
//   function reducerCount(oldCount, action){
//     let newCount;
//     if(action === '올려주세요'){
//       newCount = oldCount+1;
//     }
//     else if (action === "내려주세요") {
//       newCount = oldCount-1;
//     }
//     else {
//       newCount = 0
//     }
//     return newCount;
//   }
//   // 장부의 초기내용
//   const initCount = 0;
//   const [count, dispatchCount] = useReducer(reducerCount, initCount);

//   function increase(){
//     const action = '올려주세요';
//     dispatchCount(action);
//   }
//   function reset(){
//     const action = '초기화 해주세요';
//     dispatchCount(action);
//   }
//   function decrease(){
//     const action = '내려주세요';
//     dispatchCount(action);
//   }
//   return (
//     <div>
//       <h1>Counter</h1>
//       <input type="button" value="+" onClick={increase}></input>
//       <input type="button" value="0" onClick={reset}></input>
//       <input type="button" value="-" onClick={decrease}></input>
//       <div>{count}</div>
//     </div>
//   );
// }

// export default App;

import './App.css';
import {Link, Routes, Route, useParams, useNavigate} from 'react-router-dom';
import {useState, useReducer, createContext, useContext} from 'react';
const themeDefault = {
  border:'10px solid gray',
  margin:20,
  padding:20
}
const themeContext = createContext(themeDefault);
function Article(props){
  const theme = useContext(themeContext);
  return <article style={theme}>
    <h2>{props.title}</h2>
    {props.body}
  </article>  
}
function Header(props){
  const theme = useContext(themeContext);
  return <header style={theme}>
    <h1><Link to="/">{props.title}</Link></h1>
  </header>
}
function Nav(props){
  const theme = useContext(themeContext);
  let lis = [];
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}><Link to={'/read/'+t.id}>{t.title}</Link></li>);
  }
  return <nav style={theme}>
    <ol>
      {lis}
    </ol>
  </nav>
}
function Read(props){
  const params = useParams();
  const id = Number(params.id);
  let title, body = '';
  for(let i=0; i<props.topics.length; i++){
    if(props.topics[i].id === id){
      title = props.topics[i].title;
      body = props.topics[i].body;
    }
  }
  return <Article title={title} body={body}></Article>
}
function Create(props){
  function submitHandler(event){
    event.preventDefault();
    let t = event.target.title.value;
    let b = event.target.body.value;
    props.onCreate(t, b);
  }
  return <article>
    <h1>Create</h1>
    <form onSubmit={submitHandler}>
      <p><input type="text" name="title" placeholder="Title"></input></p>
      <p><textarea name="body" placeholder="Body"></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}
function Update(props){
  const params = useParams();
  const id = Number(params.id);
  let _title, _body = '';
  for(let i=0; i<props.topics.length; i++){
    if(props.topics[i].id === id){
      _title = props.topics[i].title;
      _body = props.topics[i].body;
    }
  }
  const [title, setTitle] = useState(_title);
  const [body, setBody] = useState(_body);
  function submitHandler(event){
    event.preventDefault();
    let t = event.target.title.value;
    let b = event.target.body.value;
    props.onUpdate(id, t, b);
  }
  return <article>
    <h1>Update</h1>
    <form onSubmit={submitHandler}>
      <p><input type="text" name="title" placeholder="Title" value={title} onChange={event=>setTitle(event.target.value)}></input></p>
      <p><textarea name="body" placeholder="Body" value={body} onChange={event=>setBody(event.target.value)}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}
function App() {
  console.log('App render');
  const navigate = useNavigate();
  // let [topics, setTopics] = useState([
  //   {id:1, title:'html', body:'html is ...'},
  //   {id:2, title:'css', body:'css is ...'},
  //   {id:3, title:'js', body:'js is ...'}
  // ]);
  function topicsReducer(oldTopics, action){
    let newTopics = [...oldTopics];
    switch(action.type){
      case 'CREATE':
        const newTopic = {id:action.id, title:action.title, body:action.body};
        newTopics.push(newTopic);
        break;
      case 'UPDATE':
        for(let i=0; i<newTopics.length; i++){
          if(newTopics[i].id === action.id){
            newTopics[i].title = action.title;
            newTopics[i].body = action.body;
            break;
          }
        }
        break;
    }
    return newTopics;
  }
  const initTopics = [
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'js', body:'js is ...'}
  ]
  const [topics, topicsDispatch] = useReducer(topicsReducer, initTopics);
  let [nextId, setNextId] = useState(4);
  function createHandler(_title, _body){
    topicsDispatch({type:'CREATE', id:nextId, title:_title, body:_body});
    navigate('/read/'+nextId);
    setNextId(nextId+1);
  }
  function updateHandler(_id, _title, _body){
    topicsDispatch({type:'UPDATE', id:_id, title:_title, body:_body});
    navigate('/read/'+_id);
  }
  const theme = useContext(themeContext);
  const newTheme = {...theme}
  newTheme.backgroundColor='yellow';
  return <>
        <themeContext.Provider value={newTheme}>
          <Header title="React"></Header>
          <Nav topics={topics}></Nav>
        </themeContext.Provider>
      <Routes>
        <Route path="/" element={<Article title="Welcome" body="Hello, WEB"></Article>}></Route>
        <Route path="/read/:id" element={<Read topics={topics}></Read>}></Route>
        <Route path="/create" element={<Create onCreate={createHandler}></Create>}></Route>
        <Route path="/update/:id" element={<Update topics={topics} onUpdate={updateHandler}></Update>}></Route>
      </Routes>
      <Routes>
        <Route path="/" element={<Control></Control>}></Route>
        <Route path="/read/:id" element={<Control></Control>}></Route>
      </Routes>
    </>
}
function Control(){
  const params = useParams();
  console.log('params', params);
  const theme = useContext(themeContext);
  return <ul style={theme}>
    <li><Link to="/create">Create</Link></li>
    <li><Link to={'/update/'+params.id}>Update</Link></li>
    <li><input type="button" value="Delete" /></li>
  </ul> 
}

export default App;

