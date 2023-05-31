import React, { useRef } from 'react';

const CameraComponent_video = () => {
    const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
    const cameraCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoData = useRef<Blob[]>([]);
    const embedVideoData = useRef<Blob | null>(null);

    function successFunc(mediaStream: MediaStream) {
        const video = cameraVideoRef.current;
        if (video == null) return;
        video.controls = false;
        if ('srcObject' in video) {
            video.srcObject = mediaStream;
        }
        video.onloadedmetadata = () => {
            video.play();
        };
    }

    function errorFunc(err: DOMException) {
        console.log(`${err.name}: ${err.message}`);
        // always check for errors at the end.
    }

    // 启动摄像头
    const openMedia = () => { // 打开摄像头
        const opt = {
            audio: false,
            video: {
                width: 720,
                height: 360
            }
        };
        navigator.mediaDevices.getUserMedia(opt).then(successFunc).catch(errorFunc);
    };

    const startRecording = () => {
        if (cameraVideoRef.current == null) return;
        const mediaStream = cameraVideoRef.current.srcObject as MediaStream;
        mediaRecorderRef.current = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });

        const recorder = mediaRecorderRef.current;
        recorder.start();

        recorder.addEventListener('dataavailable', ev => {
            videoData.current.push(ev.data);
        });

        recorder.addEventListener('stop', () => {
            embedVideoData.current = new Blob(videoData.current);
            videoData.current = [];
        })
    };

    const endRecording = () => {
        if (mediaRecorderRef.current == null) return;
        mediaRecorderRef.current.stop();
    };

    const playVideo = () => {
        if (embedVideoData.current === null) return false;
        // 清除 video 的媒体流
        const video = cameraVideoRef.current;
        if (video == null) return;
        video.srcObject = null;
        // 把视频数据转为 URL 传给 video 的 src
        video.src = URL.createObjectURL(embedVideoData.current);
        // 播放视频
        video.play();
        // 启用 video 的控制组件
        video.controls = true;
        // 删除媒体流
        video.srcObject = null;
    };

    const exportVideo = () => {
        if (embedVideoData.current == null) return false;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(embedVideoData.current);
        link.download = 'video.webm';
        link.click();
    };

    return (
        <div>
            <video
                id="cameraVideo"
                ref={cameraVideoRef}
                style={{
                    width: '720px', height: '360px'
                }}
            />
            <canvas
                id="cameraCanvas"
                ref={cameraCanvasRef}
                width={1280}
                height={720}
                style={{
                    width: '1280px', height: '720px'
                }}
            />
            <img id="imgTag" src="" alt="imgTag" />
            <button onClick={openMedia} >打开摄像头</button>
            <button onClick={startRecording}>开始录像</button>
            <button onClick={endRecording}>停止录像</button>
            <button onClick={playVideo}>播放视频</button>
            {/* <button onClick={saveImg} >保存</button> */}
            <button onClick={exportVideo} >保存</button>
            {/* <button onClick={closeMedia} >关闭摄像头</button> */}
        </div>
    )
}

export { CameraComponent_video };