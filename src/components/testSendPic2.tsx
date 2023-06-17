import React, { useEffect, ChangeEvent } from "react";

const SendPic2 = () => {
    function sendF(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        var base64str = "";

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const imageDataUrl = reader.result as string;
                console.log('图片数据已加载:', imageDataUrl);
                // 在这里进行进一步处理，例如将 imageDataUrl 显示在页面上或发送到服务器
                const firstCommaIndex = imageDataUrl.indexOf(',');
                base64str = imageDataUrl.substring(firstCommaIndex+1);
            };

            reader.readAsDataURL(file);
        }

        var ws = new WebSocket("ws://34.92.189.46:8765/");

        ws.onopen = () => {
            alert("数据发送中...");
            ws.send(base64str)
        };

        ws.onmessage = (evt) => {
            var received_msg = evt.data;
            alert("数据已接收...");
        };

        ws.onclose = function () {
            // 关闭 websocket
            alert("连接已关闭...");
        };
    }

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const imageDataUrl = reader.result as string;
                console.log('图片数据已加载:', imageDataUrl);
                // 在这里进行进一步处理，例如将 imageDataUrl 显示在页面上或发送到服务器
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            {/* <button onClick={sendF}>Send Pic</button> */}
            <input type="file" accept="image/*" onChange={sendF} />
        </div>
    )
}

export { SendPic2 };