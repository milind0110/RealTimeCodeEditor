import React from "react";
import Avatar from "react-avatar";

export default function Client(props){
    return (
        <div className="clientCard">
            <Avatar name = {props.username} size = {50} round = "14px"/>
            <span className="clientCardUsername">{props.username}</span>
        </div>
    );
}