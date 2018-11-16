//Author: Samantha Murphy
//Necessary imports
import React, {Component} from 'react';
import {FlatList, Vibration, StyleSheet, Text, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import { bold } from 'ansi-colors';

//Main class App
export default class App extends React.Component {
  constructor(props) {
    super(props)
    //Includes the ability to display the counter (showCounter) the counter itself (count), booleans to determine if a 
    //'Start Break' or 'Start Work' button can be pressed, and an array for the log that gets displayed.
    this.state = {
      showCounter: true,
      count: 0,
      atWork: false, //Initially it is assumed that the user is neither working nor on break.
      atBreak: false,
      timeLog: [],
    }//Index for the log
    this.index=0
  }//Beginning of the log and the two arrays used for independent sets of values that are generated
  startTimeEntry;
  totalWorkTimes=[]
  totalBreakTimes=[]

  //Ensures proper time formats for the total times and the times in the log
  clockFormat = (clock) => {
    return("0" + Math.floor(clock/3600)).slice(-2)
    +":"+("0" + Math.floor(clock/60) % 60).slice(-2)
    +":"+("0" + Math.floor(clock % 60)).slice(-2)
  }

  //Ensures proper date formats for the the dates in the log
  formatDate = (theDate) => {
    return((theDate.getMonth() + 1) + '/' + theDate.getDate() + '/' + theDate.getFullYear() + ' at ' + theDate.toLocaleTimeString())
  }

  //Runs when 'Start Work' is pressed. This function first tests to make sure the user does not currently
  //have a stopwatch going, then increases the count each second.
  //If there is already a stopwatch going, the user is alerted.
  startWorkTime = () => {
    if(!this.state.atWork && !this.state.atBreak){
      this.interval = setInterval(this.causeVibrate, 1000)
      this.setState({atWork: true})
      this.state.count = 0
      this.startTimeEntry = new Date()
    }
    if(!this.state.atWork && this.state.atBreak){
      alert("You have a timer going.")
    }
  }

  //Runs when 'Start Break' is pressed. This function first tests to make sure the user does not currently
  //have a stopwatch going, then increases the count each second.
  //If there is already a stopwatch going, the user is alerted.
  startBreakTime = () => {
    if(!this.state.atWork && !this.state.atBreak){
      this.interval = setInterval(this.causeVibrate, 1000)
      this.setState({atBreak: true})
      this.state.count = 0
      this.startTimeEntry = new Date()
    }
    if(this.state.atWork && !this.state.atBreak){
      alert("You have a timer going.")
    }
  }

  //This function causes vibration at 30 minutes when the work timer is running, and at 20 minutes when the
  //break timer is running.
  causeVibrate = () => { 
    if(this.state.count == 1800 && this.state.atWork ){ //Vibrate for 'work'
      Vibration.vibrate([0, 1000, 2000, 1000])
      alert("Please take a break!")
    }
    if(this.state.count == 1200 && this.state.atBreak ){ //Vibrate for 'work'
      Vibration.vibrate([0, 1000, 2000, 1000])
      alert("Please get back to work!")
    }
    this.setState({count: this.state.count + 1})//Adds 1 second to the counter
  }

  //This function causes the timer to stop running for either Work or Break timers as long as the stopwatch
  //is currently running.
  stop = () => {
    if(this.state.atWork){
      this.totalWorkTimes.push(this.state.count)
    }
    if(this.state.atBreak){
      this.totalBreakTimes.push(this.state.count)
    }
    clearInterval(this.interval)
    if (this.state.atWork) {
      this.setState({
        atWork: false,
        timeLog: [...this.state.timeLog, {key: (this.index++).toString(), timeEntry:"Work",
          startTimeEntry:this.formatDate(this.startTimeEntry), endTimeEntry:this.formatDate(new Date())}
        ]})
    }
    if (this.state.atBreak) {
      this.setState({
        atBreak: false,
        timeLog: [...this.state.timeLog, {key: (this.index++).toString(), timeEntry:"Break",
          startTimeEntry:this.formatDate(this.startTimeEntry), endTimeEntry:this.formatDate(new Date())}
        ]})
    }
  }

  //This function resets the time currently on the clock.
  reset = () => {
    clearInterval(this.interval)
    this.setState({
      count: 0,
      atBreak: false,
      atWork: false})
  }

  //This function displays a time entry in the log.
  renderItem = (timeItem) => {
    return(
      <Text style={styles.test1}>
        {timeItem.item.timeEntry  //"Work [or] Break"
          + "\n\n Started on: " + timeItem.item.startTimeEntry //Start 'time' and 'date'
          + "\n End time: " + (timeItem.item.endTimeEntry) + "\n"//End 'time' and 'date'
          }
      </Text>
    )
  }

  //This displays all components of the app.
  render() {
    if (this.state.showCounter) {
      return (
        <View style={styles.appContainer}>
          <Text style={styles.showTime}>{this.clockFormat(this.state.count)}</Text>
          <ButtonsRow style={styles.buttonsRow}>
            <Button style={styles.resetButton} title="Reset" color='#A9A9A9' onPress={this.reset}></Button>
            <Button title="Stop" color='#FF0044' onPress={this.stop}></Button>
            <Button title="Start Break" color='#00FF66' onPress={this.startBreakTime}></Button>
            <Button title="Start Work" color='#0088FF' onPress={this.startWorkTime}></Button>
          </ButtonsRow>
          
          <Text style={styles.showWorkLog}>{"Total work time " + this.clockFormat(this.totalWorkTimes.reduce((totalTime, addTime) => totalTime + addTime, 0))}</Text>
          <Text style={styles.showBreakLog}>{"Total break time " + this.clockFormat(this.totalBreakTimes.reduce((totalTime, addTime) => totalTime + addTime, 0))}</Text>
          <Text style={styles.showLog}>Time Log</Text>
          <FlatList style={styles.listThing} renderItem={this.renderItem} data={this.state.timeLog} keyExtractor={item=>item.key}/>
        </View>
      );
    }
  }
}

//This organizes the buttons neatly into a row across the screen.
function ButtonsRow({ children }) {
  return (
    <View style={styles.buttonsRow}>{children}</View>
  )
}

//Styles for components within the app.
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showTime:{
    color: '#FFFFFF',
    fontSize: 36,
  },
  listThing: {
    width: '90%',
    backgroundColor: '#1F1F1F',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#000000',
  },
  button: {
    borderColor: '#00FF00',
    fontSize: 10,
  },
  showWorkLog: {
    color: '#FF0000',
    fontSize: 20,
  },
  showBreakLog: {
    color: '#FF0000',
    fontSize: 20,
  },
  showLog: {
    color: '#FF00FF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  test1: {
    color: '#FFFFFF',
  }
})