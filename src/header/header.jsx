import React from "react";
import { View } from  "react-native";
import {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Text } from 'react-native-elements';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Header(){

    return(
        <div className="header">
        <h1 className="header__app-name">Mood Tracker App</h1>
        <div className="header__date"></div>
        </div>
    )
} 