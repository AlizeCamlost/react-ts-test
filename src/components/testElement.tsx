import React, { useState } from "react";
import { testnum1 } from "../utils/testFunction";

function Test1() {
    const [count, setCount] = useState(0);

    function increment(){
        setCount(count+1)
    }

    return (
        <button onClick={increment}>点击{count}次</button>
    );
}

function Test2() {
    return (
        <div>
            {testnum1()}
        </div>
    )
}

export { Test1, Test2 };