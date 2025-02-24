const MyReactComponent = ({ selected }: { selected: string }) => {
  return (
    <div
      style={{
        padding: "20px",
        margin: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "white",
      }}
    >
      <h1>React</h1>
      {selected}
    </div>
  );
};

export default MyReactComponent;
