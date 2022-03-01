import logo from "./logo.svg";
import "./App.css";
import "./Custom.css";

import React, { useState } from "react";

const data = ["apple", "banana", "orange"];

// props는 읽기 전용
function Title({ value, className }) {
  // 여기 영역은 렌더링이 될 때 실행되는 영역
  // 여러가지 계산이 가능함.

  return <h1 className={className}>{value}</h1>; // 실제 렌더링 되는 부분
}

function TodoList({ data, setArr }) {
  return (
    <div>
      {data.map((v) => (
        <>
          <li key={`${v}-key`}>{v}</li>
          <button
            onClick={() => {
              setArr(data.filter((f) => f !== v));
            }}
          >
            삭제
          </button>
        </>
      ))}
    </div>
  );
}

// 자식 컴포넌트에서 부모 컴포넌트 state를 바꾸려면 항상 props로 관리를 해야한다.
function TodoInput({ text, setText, arr, setArr }) {
  return (
    <>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }} // setText에 의해서 렌더링이 발생
      />
      <button
        onClick={() => {
          setArr([...arr, text]);
          setText("");
        }}
      >
        추가
      </button>
    </>
  );
}

function Todo() {
  const [text, setText] = useState("");
  const [arr, setArr] = useState(["TodoList"]);

  return (
    <>
      <TodoInput text={text} setText={setText} arr={arr} setArr={setArr} />
      {/**
       * 자식의 자식의 자식에서 증조 컴포넌트 바꾸려면? << 이게 React 최대 단점.
       * 이거는 해결하려면 어려움. Context, Redux 같은 전역 상태 라이브러리를 써야함.
       *
       */}
      <TodoList data={arr} setArr={setArr} />
    </>
  );
}

function App() {
  // count = 100
  // count = "Hello World";

  // setState 값을 덮어씌우는 방식.
  // props, state << 절대 읽기 값은 바꾸면 안됨.

  return (
    <div className="App">
      <Todo />
    </div>
  );
}

export default App;



// 렌더링은 곧 컴포넌트 함수 실행

// 얘네 함수 실행 = 렌더링

// 언제 일어나느냐
// * state 변경
// * props 변경
// * 부모 컴포넌트가 렌더링 됐을 때

// Keyword
// * 렌더링 일어나는 시점.

// * props에다가 state 전달

// * Component 만들기
// 유에서 유를 창조 => map (리액트에선 이걸 제일 많이씀)
// 무에서 유를 창조 => for 문
// 유에서 무를 창조 => forEach


// import logo from "./logo.svg";
// import "./App.css";
// import "./Custom.css";

// import React, { useState } from "react";

// function OnlyProps({ data }) {
//   // 이 컴포넌트는 props만 존재
//   console.log("렌더링 됐음");
//   return <div>{data}입니다.</div>;
// }
// function Child() {
//   console.log("렌더링!!");
//   return <h1>자식</h1>;
// }

// function Parent() {
//   const [count, setCount] = useState(0);
//   return (
//     <div>
//       <button onClick={() => setCount(count + 1)}>Click Me</button>
//       <Child />
//     </div>
//   );
// }

// function App() {
//   return (
//     <div className="App">
//       <Parent />
//     </div>
//   );
// }

// export default App;

// // 유에서 유를 창조 => map (리액트에선 이걸 제일 많이씀)
// // 무에서 유를 창조 => for 문
// // 유에서 무를 창조 => forEach


// 조건부 랜더링
// import logo from "./logo.svg";
// import "./App.css";
// import "./Custom.css";

// import React, { useState } from "react";

// function Page1() {
//   return (
//     <div>
//       <h1>자기소개 페이지입니다.</h1>
//       <p>이름 ~~~~</p>
//     </div>
//   );
// }
// function Page2() {
//   return (
//     <div>
//       <p>준비중</p>
//     </div>
//   );
// }

// function App() {
//   const [show, setShow] = useState(false);

//   return (
//     <div className="App">
//       <button onClick={() => setShow(!show)}>Show</button>
//       {show === false ? <Page1 /> : <Page2 />}
//     </div>
//   );
// }

// export default App;

// // 유에서 유를 창조 => map (리액트에선 이걸 제일 많이씀)
// // 무에서 유를 창조 => for 문
// // 유에서 무를 창조 => forEach