import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Dimensions, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import Svg, { Path } from 'react-native-svg';
import { LineChart } from 'react-native-chart-kit';
import {
  Button,
  Text,
  TextField,
} from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import DataStore from '../models/DataStore';
const logo = require("../../assets/images/logo-41.png")
interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> { }
const screenWidth = Dimensions.get('window').width

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  //textFields
  const [points, setPoints] = useState("")
  const [name, setName] = useState("")
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch('https://awqgdt2ss8.execute-api.us-east-1.amazonaws.com/Prod/history');
        const data = await response.json();
        DataStore.updateData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  },[])

  // in chart: above 0 green, or white
  const dotColor = (value: number) => (value >= 0 ? '#A7FF89' : '#FFF');

  // helper function
  const timeNumberToTime = (value: number)=> {
    const hour = Math.floor(value/60)
    const minutes = value % 60
    return hour+":"+minutes;
  }
  const percentage = (total: number, rest: number)=>{
    return Math.round(rest*100/total)
  }


  const handleButtonClick = () => {
    DataStore.updateName(name)
    DataStore.updatePoints(Number.parseInt(points))
    setName("")
    setPoints("")
  }

  // only allow number
  const handlePointsChange = (text: string) => {
    const numericInput = text.replace(/[^0-9]/g, '');
    setPoints(numericInput);
  };
  // only allow valid char
  const handleNameChange = (text: string) => {
    const cleanText = text.replace(/[^a-zA-Z ]/g, '').trim();
    setName(cleanText);
  }

  return (
    <View style={$container}>
      <Image source={logo} style={$logoStyle} resizeMode="contain" />
      <View style={$chartContainer}>
        <Text text="Points per WOD" style={$chartTitle}></Text>
      <LineChart
        data={DataStore.data.chartData}
        width={screenWidth*0.9}
        height={220}
        yAxisInterval={1}
        withShadow={false}
        chartConfig={{
          backgroundColor: '#222B31',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        getDotProps={(value) => ({
          r: '3',
          strokeWidth: '2',
          stroke: dotColor(value),
          fill: dotColor(value),
        })}
        style={{
        }}
      />
      </View>

      <View style={$cardContainer}>
        <Text style={$cardTitle} text="History:"></Text>
        <View style={$cardBody}>
          <View style={$leftComponent}>
            <Text text={DataStore.data.date_time.split('T')[0]} style={$date}></Text>
            <Text text={DataStore.data.name} style={$username}></Text>
            <View style={$workoutData}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 10 }}>
                <Text text="Time: " style={$label}></Text>
                <Text text={timeNumberToTime(DataStore.data.time)} style={$labelData}></Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 13 }}>
                <Text text="Rest: " style={$label}></Text>
                <Text text={timeNumberToTime(DataStore.data.rest)+" | "+
                percentage(DataStore.data.time,DataStore.data.rest)+"%"} style={$labelData}></Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 6 }}>
                <Svg xlmns='https://www.w3.org/2000/svg' width='16' height="14" viewBox="0 0 16 14" fill="none">
                  <Path d="M8.43503 2.82162C9.70104 0.688424 11.4945 0.293288 12.7587 0.584534L12.7586 0.585026C14.3714 0.956833 15.5 2.38161 15.5 4.06011C15.5 5.45967 14.9514 6.67878 14.0302 7.8806C13.1005 9.09365 11.8218 10.2513 10.3999 11.5356L10.3985 11.5368C10.0174 11.8837 9.69789 12.1832 9.42714 12.4404C9.0007 12.8434 8.69863 13.1179 8.45212 13.294C8.2075 13.4686 8.07938 13.5 8 13.5C7.92065 13.5 7.79254 13.4686 7.54788 13.2939C7.30135 13.1179 6.99928 12.8433 6.57284 12.4404C6.30337 12.1844 5.98308 11.8814 5.60043 11.5359C4.17855 10.2477 2.8997 9.08671 1.96979 7.87281C1.04825 6.66985 0.5 5.45272 0.5 4.06011C0.5 2.38478 1.62818 0.959524 3.24165 0.584961C4.51164 0.292763 6.3064 0.687879 7.57528 2.82197L8.00545 3.54546L8.43503 2.82162Z" stroke="#E22726" />
                </Svg>
                <Text text={" "+DataStore.data.hr} style={$username}></Text>
              </View>
            </View>
            <View style={{ flex: 10 }}>
              <Text text={DataStore.data.exercises}
                style={$exercises}></Text>
            </View>
          </View>
          <View style={$rightComponent}>
            <Text text={"+"+DataStore.data.points} style={$pointsText} />
            <Text text="Total Points" style={$totalPointsText} />
          </View>
        </View>
      </View>
      <View style={[$bottomContainer, $bottomContainerInsets]}>
        <TextField value={points} onChangeText={handlePointsChange} containerStyle={{ flex: 1 }} style={{ color: '#FFF', fontSize: 15 }}
          label='Points' LabelTextProps={{ style: $bottomLable }} inputWrapperStyle={$bottomInput}></TextField>
        <TextField value={name} onChangeText={handleNameChange} containerStyle={{ flex: 1 }} style={{ color: '#FFF', fontSize: 15 }} label='Name' LabelTextProps={{ style: $bottomLable }} inputWrapperStyle={$bottomInput}></TextField>
        <Button onPress={handleButtonClick} style={$submitBtn} textStyle={$btnText} text="SUBMIT">
        </Button>
      </View>
    </View>
  )
})

const $logoStyle: ImageStyle = {
  flex: 1,
  marginTop:50,
  width: 136,
  height: 31,
  alignSelf: "center",
}

const $chartContainer: ViewStyle = {
  flex: 12,
  paddingTop:10,
  height:215,
  alignSelf:'center',
}

const $cardContainer: ViewStyle = {
  flex: 11,
  flexDirection: 'column',
  marginHorizontal: 15,
}
const $bottomContainer: ViewStyle = {
  flex: 10,
  alignItems: 'center',
  flexDirection: 'column',
  marginBottom:30,
}

const $bottomInput: ViewStyle = {
  backgroundColor: '#1F262B',
  width: screenWidth * 0.4,
  borderWidth: 0,
  borderRadius: 11,
}
const $chartTitle: TextStyle = {
  color:'#FFF',
  fontSize:15,
  fontWeight:'600',
  paddingLeft:10,
}
const $exercises: TextStyle = {
  color: '#FFF',
  fontSize: 11,
  lineHeight: 15,
}
const $label: TextStyle = {
  color: '#7B7B7B',
  fontSize: 11,
}
const $labelData: TextStyle = {
  color: '#FFF',
  fontSize: 16,
}
const $date: TextStyle = {
  color: '#8C8279',
  fontSize: 11,
  flex: 2,
}
const $bottomLable: TextStyle = {
  color: '#FFF',
  fontSize: 15,
  fontWeight: '400',
  lineHeight: 25,
}
const $btnText: TextStyle = {
  color: '#20262A',
  textAlign: 'center',
  fontSize: 20,
  lineHeight: 25,
  fontWeight: '700',
}
const $submitBtn: ViewStyle = {
  width: 193,
  borderRadius: 11,
  alignSelf: 'center',
  marginTop:15,
}

const $username: TextStyle = {
  color: '#FFF',
  fontSize: 15,
  flex: 2,
}
const $workoutData: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 7,
}
const $rightComponent: ViewStyle = {
  flex: 2,
  flexDirection: 'column',
  backgroundColor: '#000',
  alignItems: 'center',
}
const $leftComponent: ViewStyle = {
  flex: 5,
  backgroundColor: '#20262A',
  flexDirection: 'column',
  padding: 10,
  paddingRight: 0,
}
const $cardBody: ViewStyle = {
  flex: 6,
  flexDirection: 'row',
  borderRadius: 11,
  borderColor: 'black',
  overflow: 'hidden'
}
const $pointsText: TextStyle = {
  color: '#A8FF89',
  fontSize: 32,
  paddingTop: 50,
}
const $totalPointsText: TextStyle = {
  color: "#7B7B7B",
  fontSize: 13,
  flex: 2,
}
const $container: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
  flexDirection: 'column',
}

const $cardTitle: TextStyle = {
  flex: 1,
  fontSize: 20,
  textDecorationLine: 'underline',
  color: '#FFF',
}