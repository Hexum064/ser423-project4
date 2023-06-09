/*

Class: SER423
Project: 4

Author: Branden Boucher
Original Author: React Native Cookbook - Second Edition
Repo: https://github.com/warlyware/react-native-cookbook

*/

import React, { Component } from 'react';
import { Audio } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const pickerOptions = ["na", "1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"];

const playlist = [
    {
        id: "song1",
        title: 'People Watching',
        artist: 'Keller Williams',
        album: 'Keller Williams Live at The Westcott Theater on 2012-09-22',
        uri: 'https://ia800308.us.archive.org/7/items/kwilliams2012-09-22.at853.flac16/kwilliams2012-09-22at853.t16.mp3'
    },
    {
        id: "song2",
        title: 'Hunted By A Freak',
        artist: 'Mogwai',
        album: 'Mogwai Live at Ancienne Belgique on 2017-10-20',
        uri: 'https://ia601509.us.archive.org/17/items/mogwai2017-10-20.brussels.fm/Mogwai2017-10-20Brussels-07.mp3'
    },
    {
        id: "song3",
        title: 'Nervous Tic Motion of the Head to the Left',
        artist: 'Andrew Bird',
        album: 'Andrew Bird Live at Rio Theater on 2011-01-28',
        uri: 'https://ia800503.us.archive.org/8/items/andrewbird2011-01-28.early.dr7.flac16/andrewbird2011-01-28.early.t07.mp3'
    }
];


export default class App extends Component {
    state = {
        isPlaying: false,
        playbackInstance: null,
        volume: 1.0,
        currentTrackIndex: 0,
        isBuffering: false,
        currentRating: 'na',
    };

    //Set up the audio player on mount
    async componentDidMount() {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playThroughEarpieceAndroid: true,
            interruptionModeIOS: 1,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: 1,
        });
        this.loadAudio();
    }

    //Load the rating from storage for the current track
    loadRating = async () => {
        try {
            //First generate a key based on the song's title.
            const key = "@MyApp:" + playlist[this.state.currentTrackIndex].title.replaceAll(' ', '_');
            //Then load the rating
            this.setState({ currentRating: (await AsyncStorage.getItem(key)) ?? 'na' });

        } catch (error) {
            console.log(error);
            alert('Error', 'There was an error while loading the data');
        }
    }

    //Save the rating to storage for the current track
    saveRating = async (rating) => {
        try {

            //First generate a key based on the song's title.
            const key = "@MyApp:" + playlist[this.state.currentTrackIndex].title.replaceAll(' ', '_');                       
            //save the rating
            await AsyncStorage.setItem(key, rating);
            //set the current rating state
            this.setState({ currentRating: rating});
            
        } catch (error) {
            console.log(error);
            alert('Error', 'There was an error while saving the data');

        }
    }

    //Load the selected sound
    async loadAudio() {
        const playbackInstance = new Audio.Sound();
        const source = {
            uri: playlist[this.state.currentTrackIndex].uri
        }
        const status = {
            shouldPlay: this.state.isPlaying,
            volume: this.state.volume,
        };
        playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
        await playbackInstance.loadAsync(source, status, false);
        this.setState({ playbackInstance });
        this.loadRating();
    }

    //Update the state of the loading
    onPlaybackStatusUpdate = (status) => {
        this.setState({ isBuffering: status.isBuffering });
    }

    //Play/Pause button handler
    handlePlayPause = async () => {
        const { isPlaying, playbackInstance } = this.state;
        isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
        this.setState({ isPlaying: !isPlaying });
    }

    //Previous button handler
    handlePreviousTrack = async () => {
        let { playbackInstance, currentTrackIndex } = this.state;
        if (playbackInstance) {
            await playbackInstance.unloadAsync();
            currentTrackIndex === 0 ? currentTrackIndex = playlist.length - 1 : currentTrackIndex -= 1;
            this.setState({ currentTrackIndex });
            this.loadAudio();
        }
    }

    //Next button handler
    handleNextTrack = async () => {
        let { playbackInstance, currentTrackIndex } = this.state;
        if (playbackInstance) {
            await playbackInstance.unloadAsync();
            currentTrackIndex < playlist.length - 1 ? currentTrackIndex += 1 : currentTrackIndex = 0;
            this.setState({ currentTrackIndex });
            this.loadAudio();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.largeText, styles.buffer]}>
                    {this.state.isBuffering && this.state.isPlaying ?
                        'Buffering...' : null}
                </Text>
                {this.renderSongInfo()}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={styles.control}
                        onPress={this.handlePreviousTrack}
                    >
                        <Feather name="skip-back" size={32} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.control}
                        onPress={this.handlePlayPause}
                    >
                        {this.state.isPlaying ? //switch the button based on the isPlaying state
                            <Feather name="pause" size={32} color="#fff" /> :
                            <Feather name="play" size={32} color="#fff" />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.control}
                        onPress={this.handleNextTrack}
                    >
                        <Feather name="skip-forward" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={styles.ratings}>
                    <Picker style={{ flex: 1}} mode='dropdown'
                        selectedValue={this.state.currentRating}
                        value={this.state.currentRating}
                        onValueChange={this.saveRating}>
                        {pickerOptions.map((option) => {                            
                            return <Picker.Item key={option} label={option} value={option} />;
                        })}
                    </Picker>
                </View>
            </View>
        );
    }


    renderSongInfo() {
        const { playbackInstance, currentTrackIndex } = this.state;
        return playbackInstance ? <View style={styles.trackInfo}>
            <Text style={[styles.trackInfoText, styles.largeText]}>
                {playlist[currentTrackIndex].title}
            </Text>
            <Text style={[styles.trackInfoText, styles.smallText]}>
                {playlist[currentTrackIndex].artist}
            </Text>
            <Text style={[styles.trackInfoText, styles.smallText]}>
                {playlist[currentTrackIndex].album}
            </Text>
            <Text style={[styles.trackInfoText, styles.smallText]}>
                Rating: {this.state.currentRating}
            </Text>
        </View>
            : null;

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191A1A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    trackInfo: {
        padding: 40,
        backgroundColor: '#191A1A',
    },
    buffer: {
        color: '#fff'
    },
    trackInfoText: {
        textAlign: 'center',
        flexWrap: 'wrap',
        color: '#fff'
    },
    largeText: {
        fontSize: 22
    },
    smallText: {
        fontSize: 16
    },
    control: {
        margin: 20
    },
    controls: {
        flexDirection: 'row'
    },
    ratings: {
        flexDirection: 'row',
        backgroundColor: '#DDD'
    }
});
