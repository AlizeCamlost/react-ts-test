import React from 'react';
import './App.css';
import {Test1, Test2} from './components/testElement';
import { CameraComponent } from './components/cameraComponent';
import { CameraComponent_video } from './components/cameraComponent_video';
import { SendPic } from './components/testSendPic';

function App() {
  return (
    <div className="App">
      <CameraComponent_video />
      {/* <SendPic /> */}
    </div>
  );
}

export default App;
