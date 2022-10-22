const name: string = "hello";
const age: number = 10;
function App(props: any) {
  const children = props.children;
  return (
    <>
      <h1>{props.name}</h1>
    </>
  );
}
export default App;
