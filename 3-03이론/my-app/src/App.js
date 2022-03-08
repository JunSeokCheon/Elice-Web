import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonGroup, Container, Row, Col, Modal } from 'react-bootstrap';
import {Link, Routes, Route, useParams, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
function Article(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>   
}
function Header(props){
  const style = {
    textDecoration: 'none'
  }
  return <header>
    <h1><Link to="/" style={style}>{props.title}</Link></h1>
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
  console.log('Read render');
  const params = useParams();
  const id = Number(params.id);
  const [title, setTitle] = useState('Loading....');
  const [body, setBody] = useState('Loading....');
  useEffect(function(){
    fetch('http://localhost:4000/topics/'+id)
    .then(function(request){
      return request.json();
    })
    .then(function(response){
      setTitle(response.title);
      setBody(response.body);
    })
  }, [id]);
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
  /*
  let _title, _body = '';
  for(let i=0; i<props.topics.length; i++){
    if(props.topics[i].id === id){
      _title = props.topics[i].title;
      _body = props.topics[i].body;
    }
  }
  const [title, setTitle] = useState(_title);
  const [body, setBody] = useState(_body);
  */

  const [title, setTitle] = useState('Loading....');
  const [body, setBody] = useState('Loading....');
  useEffect(function(){
    fetch('http://localhost:4000/topics/'+id)
    .then(function(request){
      return request.json();
    })
    .then(function(response){
      setTitle(response.title);
      setBody(response.body);
    })
  }, [id]);

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
  let [topics, setTopics] = useState([]);

  function refreshTopics(){
    fetch('http://localhost:4000/topics')
    .then(function(request){
      return request.json();
    })
    .then(function(response){
      setTopics(response);
    });
  }

  // 방법 1
  useEffect(refreshTopics, []);

  /*
  //방법 2
  useEffect(function(){
    async function refreshTopics(){
      const request = await fetch('http://localhost:4000/topics');
      const response = await request.json();
      setTopics(response);
    }
    refreshTopics();
  }, []);
  */

  let [nextId, setNextId] = useState(4);
  async function createHandler(_title, _body){
    const request = await fetch('http://localhost:4000/topics',{
      method:'POST', 
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({title:_title, body:_body})
    });
    const response = await request.json();
    navigate('/read/'+response.id);
    refreshTopics();
  }
  async function updateHandler(_id, _title, _body){
    const request = await fetch('http://localhost:4000/topics/'+_id,{
      method:'PUT', 
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({id:_id, title:_title, body:_body})
    });
    const response = await request.json();
    navigate('/read/'+response.id);
    refreshTopics();
  }
  async function deleteHandler(id){
    const request = await fetch('http://localhost:4000/topics/'+id,{
      method:'DELETE'
    });
    const response = await request.json();
    navigate('/');
    refreshTopics();
  }
  return <Container>
      <Header title="React"></Header>
      <Row xs={3}>
        <Col><Nav topics={topics}></Nav></Col>
        <Col>
          <Routes>
            <Route path="/" element={<Article title="Welcome" body="Hello, WEB"></Article>}></Route>
            <Route path="/read/:id" element={<Read topics={topics}></Read>}></Route>
            <Route path="/create" element={<Create onCreate={createHandler}></Create>}></Route>
            <Route path="/update/:id" element={<Update topics={topics} onUpdate={updateHandler}></Update>}></Route>
          </Routes>
          <Routes>
            <Route path="/" element={<Control></Control>}></Route>
            <Route path="/read/:id" element={<Control onDelete={deleteHandler}></Control>}></Route>
          </Routes>
        </Col>
      </Row>
      
    </Container>
}
function Control(props){
  const params = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  function handleClose(){
    setShow(false);
  };
  return <>
    <ButtonGroup>
      <Button onClick={()=>{navigate('/create')}}>Create</Button>
      <Button onClick={()=>{navigate('/update/'+params.id)}}>Update</Button>
      <Button onClick={()=>{
        setShow(true);
      }}>Delete</Button>
    </ButtonGroup>
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Danger!!</Modal.Title>
    </Modal.Header>
    <Modal.Body>지울꼬야~?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={() => {
        props.onDelete(params.id);
        handleClose();
      }}>
        Delete
      </Button>
    </Modal.Footer>
  </Modal>
</>
}

export default App;
