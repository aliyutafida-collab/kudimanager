export default function Loading() {
  return (
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginTop: "40px"
    }}>
      <div 
        style={{
          width: "120px",
          height: "4px",
          background: "linear-gradient(90deg,#4f46e5,#6366f1,#818cf8)",
          animation: "loading 1.5s infinite"
        }}
      />
      <style>
        {`
        @keyframes loading {
          0% { transform: translateX(-50px) scaleX(0.3); opacity: 0.5; }
          50% { transform: translateX(0px) scaleX(1); opacity: 1; }
          100% { transform: translateX(50px) scaleX(0.3); opacity: 0.5; }
        }
        `}
      </style>
    </div>
  );
}
