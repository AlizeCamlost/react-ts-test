import React, { useState, useRef, ChangeEvent } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import "../style/cameraComponentStyle.css";

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
                width: 128,
                height: 128
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
        console.log(embedVideoData.current);
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

    const sendVideo = () => {
        if (embedVideoData.current === null) return;
        const videoBlob = embedVideoData.current;

        // 创建一个新的WebSocket连接
        const socket = new WebSocket('ws://34.92.189.46:8765/');

        // 当WebSocket连接打开时
        socket.onopen = function (event) {
            // 将视频数据发送到服务器
            socket.send(videoBlob);
        };

        // 当接收到服务器的响应消息时
        socket.onmessage = function (event) {
            console.log('服务器响应：', event.data);
            // 在这里处理服务器的响应
        };

        // 当WebSocket连接关闭时
        socket.onclose = function (event) {
            console.log('WebSocket连接已关闭');
        };
    };

    const [frameUrl, setFrameUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => {
                // 确保视频加载完成后获取帧
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');
                if (context) {
                    video.currentTime = 5; // 设置时间戳为5秒
                    video.addEventListener('seeked', () => {
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const frameDataUrl = canvas.toDataURL('image/jpeg');
                        setFrameUrl(frameDataUrl);
                        downloadFrame(frameDataUrl);
                    });
                }
            };
        }
    };

    const downloadFrame = (dataUrl: string) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'frame.jpeg';
        link.click();
    };

    return (
        <div className="container_col">
            <div>
                <video
                    id="cameraVideo"
                    ref={cameraVideoRef}
                    className="video"
                />
            </div>
            <div className="container_vol">
                <button className="button" onClick={openMedia} >Open Camera</button>
                <button className="button" onClick={startRecording}>Start Recording</button>
                <button className="button" onClick={endRecording}>Stop Recording</button>
                <button className="button" onClick={playVideo}>Play Video</button>
                <button className="button" onClick={exportVideo} >Save</button>
                <button className="button" onClick={sendVideo} >Send</button>
                <input type="file" accept="video/webm" onChange={handleFileChange} />
                {frameUrl && <img src={frameUrl} alt="Frame" />}
            </div>
        </div>
    )
}

export { CameraComponent_video };