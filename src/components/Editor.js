import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from "../Actions";

export default function Editor({ socketRef, onCodeChange }) {
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(document.getElementById("realTimeCodeEditor"), {
                mode: { name: 'javascript', json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
                lineWrapping: true
            })


            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== "setValue") {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        code,
                    })
                }
            })
        }
        init();
    }, []);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
                console.log("received", code);
                editorRef.current.setValue(code);
            });
        }
    }, [socketRef.current]);
    return (
        <textarea id="realTimeCodeEditor"></textarea>
    );
}