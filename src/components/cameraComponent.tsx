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
        const imgStr = canvas.toDataURL(); // 将图片资源转成字符串
        const base64Img = imgStr.split(';base64,').pop(); // 将图片资源转成base64格式
        const imgData = {
            base64Img
        };
        closeMedia(); // 获取到图片之后可以自动关闭摄像头
        return imgData;
    };


    const saveImg = () => { // electron项目保存到本地
        const data = getImg();
        const imgel = document.getElementById('imgTag') as HTMLImageElement|null;
        if(data===undefined)return;
        if(imgel==null)return;
        imgel.src = data.base64Img as string;
        // 网页保存图片的方法
        const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement|null;
        if(saveLink==null)return;
        saveLink.href = data.base64Img as string;
        saveLink.download = './i.png';
        const event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        saveLink.dispatchEvent(event);
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
                // width={1280}
                // height={720}
                // style={{
                //     width: '1280px', height: '720px'
                // }}
            />
            <img id="imgTag" src="" alt="imgTag" />
            <button onClick={openMedia} >打开摄像头</button>
            <button onClick={saveImg} >保存</button>
            <button onClick={closeMedia} >关闭摄像头</button>
        </div>
    )
}

export {CameraComponent};