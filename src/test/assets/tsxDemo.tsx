const name: string = "hello";
const age: number = 10;
function App(props: any) {
  console.log("props:",props);
  const children = props.children;
  return (
    <>
      <h1>{props.name}</h1>
    </>
  );
}
export default App;
