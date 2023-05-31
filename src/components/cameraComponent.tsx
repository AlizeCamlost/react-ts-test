import React, { useRef } from 'react';

const CameraComponent = () => {

    const cameraVideoRef = useRef<HTMLVideoElement|null>(null);
    const cameraCanvasRef = useRef<HTMLCanvasElement|null>(null);

    function successFunc(mediaStream:MediaStream) {
        const video = cameraVideoRef.current;
        // const video = document.getElementById('cameraVideo') as HTMLVideoElement;
        // 旧的浏览器可能没有srcObject
        if(video==null)return;
        if ('srcObject' in video) {
            video.srcObject = mediaStream;
        }
        video.onloadedmetadata = () => {
            video.play();
        };
    }

    function errorFunc(err:DOMException) {
        console.log(`${err.name}: ${err.message}`);
        // always check for errors at the end.
    }
    // 启动摄像头
    const openMedia = () => { // 打开摄像头
        const opt = {
            audio: false,
            video: {
                width: 1280,
                height: 720
            }
        };
        navigator.mediaDevices.getUserMedia(opt).then(successFunc).catch(errorFunc);
    };

    // 关闭摄像头
    const closeMedia = () => {
        // const video = document.getElementById('cameraVideo') as HTMLVideoElement;
        const video = cameraVideoRef.current;
        if(video==null)return;
        const stream = video.srcObject;
        if(stream==null)return;
        if ('getTracks' in stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => {
                track.stop();
            });
        }
    };

    const getImg = () => { // 获取图片资源
        // const video = document.getElementById('cameraVideo') as HTMLVideoElement;
        // const canvas = document.getElementById('cameraCanvas') as HTMLCanvasElement;
        const video = cameraVideoRef.current;
        const canvas = cameraCanvasRef.current;
        if (canvas == null || video == null) {
            return;
        }
        const ctx = canvas.getContext('2d');
        if(ctx==null)return;
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight); // 把视频中的一帧在canvas画布里面绘制出来
        // const imgStr = canvas.toDataURL(); // 将图片资源转成字符串
        // const base64Img = imgStr.split(';base64,').pop(); // 将图片资源转成base64格式
        // const imgData = {
        //     base64Img
        // };
        const imgData = canvas.toDataURL('image/jpeg');
        closeMedia(); // 获取到图片之后可以自动关闭摄像头
        return imgData;
    };

    const download = () => {
        const imgData = getImg();
        if(imgData === null || imgData === undefined) return false;
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'image.jpg';
        link.click()
    };

    return (
        <div>
            <video
                id="cameraVideo"
                ref={cameraVideoRef}
                style={{
                    width: '1280px', height: '720px'
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
            {/* <button onClick={saveImg} >保存</button> */}
            <button onClick={download} >保存</button>
            <button onClick={closeMedia} >关闭摄像头</button>
        </div>
    )
}

export {CameraComponent};