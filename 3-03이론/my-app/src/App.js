import './App.css';
import {Link, Routes, Route, useParams, useNavigate} from 'react-router-dom';
import {useState} from 'react';
function Article(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>  
}
function Header(props){
  return <header>
    <h1><Link to="/">{props.title}</Link></h1>
  </header>
}
function Nav(props){
  let lis = [];
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}><Link to={'/read/'+t.id}>{t.title}</Link></li>);
  }
  
  return <nav>
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
  let [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'js', body:'js is ...'}
  ]);
  let [nextId, setNextId] = useState(4);
  function createHandler(_title, _body){
    let newTopics = [...topics];
    const newTopic = {id:nextId, title:_title, body:_body};
    newTopics.push(newTopic);
    setTopics(newTopics);
    navigate('/read/'+nextId);
    setNextId(nextId+1);
  }
  function updateHandler(_id, _title, _body){
    let newTopics = [...topics];
    for(let i=0; i<newTopics.length; i++){
      if(newTopics[i].id === _id){
        newTopics[i].title = _title;
        newTopics[i].body = _body;
      }
    }
    setTopics(newTopics);
    navigate('/read/'+_id);
  }
  return <>
      <Header title="React"></Header>
      <Nav topics={topics}></Nav>
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
  return <ul>
    <li><Link to="/create">Create</Link></li>
    <li><Link to={'/update/'+params.id}>Update</Link></li>
    <li><input type="button" value="Delete" /></li>
  </ul> 
}

export default App;