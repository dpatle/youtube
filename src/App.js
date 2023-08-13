import logo from "./logo.svg";
import "./App.css";
import { Build } from "./build";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Player } from "./player";

function App() {
  const [mode, setMode] = useState(0);
  const [clips, setClips] = useState([{}]);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  return (
    <div className="App">
      {mode === 0 && (
        <Build
          clips={clips}
          onFormBuild={(clips) => {
            setClips(clips);
            setMode(1);
          }}
        />
      )}
      {mode === 1 &&
        clips.map((clip, index) =>
          index === currentClipIndex ? (
            <Player
              clip={clip}
              play={true}
              goHome={() => setMode(0)}
              onEnded={() => {
                if (currentClipIndex < clips.length - 1) {
                  setCurrentClipIndex((prev) => prev + 1);
                }
              }}
            />
          ) : null
        )}
    </div>
  );
}

export default App;
