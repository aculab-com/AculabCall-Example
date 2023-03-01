import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { styles, COLOURS } from './styles';
import { RTCView } from 'react-native-webrtc';
import {
  AculabCall,
  turnOnSpeaker,
  deleteSpaces,
  initializeCallKeep,
} from 'react-native-aculab-client';
import { MenuButton } from './components/MenuButton';
import { KeypadButton } from './components/KeypadButton';
import { CallButton } from './components/CallButton';
import { RoundButton } from './components/RoundButton';
import { useNavigation } from '@react-navigation/native';
import { name as appName } from '../app.json';

interface AcuCallProps {
  acuCall: AcuCall;
}

const MainCallButtons = (props: AcuCallProps) => {
  return (
    <View style={styles.callButtonsContainer}>
      <CallButton
        title={'Hang up'}
        colour={COLOURS.RED}
        onPress={() => props.acuCall.stopCall()}
      />
      <CallButton
        title={'Speaker'}
        colour={COLOURS.SPEAKER_BUTTON}
        onPress={() =>
          props.acuCall.setState(
            { speakerOn: !props.acuCall.state.speakerOn },
            () => turnOnSpeaker(props.acuCall.state.speakerOn)
          )
        }
      />
    </View>
  );
};

const DialKeypad = (props: AcuCallProps) => {
  return (
    <View style={styles.dialKeypad}>
      {props.acuCall.state.callState === 'calling' ||
      props.acuCall.state.callState === 'ringing' ? (
        <View>
          <Text style={styles.callingText}>
            Calling {props.acuCall.state.serviceName}
          </Text>
        </View>
      ) : (
        <View>
          <Text style={styles.callingText}>
            Service {props.acuCall.state.serviceName}
          </Text>
        </View>
      )}
      <View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'1'}
            onPress={() => props.acuCall.sendDtmf('1')}
          />
          <KeypadButton
            title={'2'}
            onPress={() => props.acuCall.sendDtmf('2')}
          />
          <KeypadButton
            title={'3'}
            onPress={() => props.acuCall.sendDtmf('3')}
          />
        </View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'4'}
            onPress={() => props.acuCall.sendDtmf('4')}
          />
          <KeypadButton
            title={'5'}
            onPress={() => props.acuCall.sendDtmf('5')}
          />
          <KeypadButton
            title={'6'}
            onPress={() => props.acuCall.sendDtmf('6')}
          />
        </View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'7'}
            onPress={() => props.acuCall.sendDtmf('7')}
          />
          <KeypadButton
            title={'8'}
            onPress={() => props.acuCall.sendDtmf('8')}
          />
          <KeypadButton
            title={'9'}
            onPress={() => props.acuCall.sendDtmf('9')}
          />
        </View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'*'}
            onPress={() => props.acuCall.sendDtmf('*')}
          />
          <KeypadButton
            title={'0'}
            onPress={() => props.acuCall.sendDtmf('0')}
          />
          <KeypadButton
            title={'#'}
            onPress={() => props.acuCall.sendDtmf('#')}
          />
        </View>
      </View>
    </View>
  );
};

const ClientCallButtons = (props: AcuCallProps) => {
  var videoIcon: string = '';
  var audioIcon: string = '';
  if (!props.acuCall.state.camera) {
    videoIcon = 'eye-off-outline';
  } else {
    videoIcon = 'eye-outline';
  }
  if (!props.acuCall.state.mic) {
    audioIcon = 'mic-off-outline';
  } else {
    audioIcon = 'mic-outline';
  }
  return (
    <View style={styles.callButtonsContainer}>
      <RoundButton
        iconName={'camera-reverse-outline'}
        onPress={() => props.acuCall.swapCam()}
      />
      <RoundButton
        iconName={videoIcon}
        onPress={() =>
          props.acuCall.setState({ camera: !props.acuCall.state.camera }, () =>
            props.acuCall.mute()
          )
        }
      />
      <RoundButton
        iconName={audioIcon}
        onPress={() =>
          props.acuCall.setState({ mic: !props.acuCall.state.mic }, () =>
            props.acuCall.mute()
          )
        }
      />
    </View>
  );
};

const CallOutComponent = (props: AcuCallProps) => {
  return (
    <View style={styles.inputContainer}>
      <View>
        <Text style={styles.basicText}>Service Name</Text>
        <TextInput
          style={styles.input}
          placeholder={'example: --15993377'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text =>
            props.acuCall.setState({
              serviceName: deleteSpaces(text),
            })
          }
          value={props.acuCall.state.serviceName}
          keyboardType={'ascii-capable'}
        />
        <MenuButton
          title={'Call Service'}
          onPress={() =>
            props.acuCall.startCall('service', props.acuCall.state.serviceName)
          }
        />
      </View>
      <View>
        <Text style={styles.basicText}>Client ID</Text>
        <TextInput
          style={styles.input}
          placeholder={'example: anna123'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text =>
            props.acuCall.setState({
              callClientId: deleteSpaces(text),
            })
          }
          value={props.acuCall.state.callClientId}
        />
        <MenuButton
          title={'Call Client'}
          onPress={() =>
            props.acuCall.startCall('client', props.acuCall.state.callClientId)
          }
        />
      </View>
    </View>
  );
};

const DisplayClientCall = (props: AcuCallProps) => {
  if (
    props.acuCall.state.outboundCall &&
    props.acuCall.state.callState !== 'connected'
  ) {
    return (
      <View style={styles.center}>
        <Text style={styles.callingText}>
          Calling {props.acuCall.state.callClientId}
        </Text>
      </View>
    );
  } else if (
    props.acuCall.state.inboundCall &&
    props.acuCall.state.callState !== 'connected'
  ) {
    return (
      <View style={styles.center}>
        <Text style={styles.callingText}>
          Calling {props.acuCall.state.incomingCallClientId}
        </Text>
      </View>
    );
  } else {
    if (props.acuCall.state.remoteStream && props.acuCall.state.localStream) {
      switch (true) {
        case props.acuCall.state.localVideoMuted &&
          !props.acuCall.state.remoteVideoMuted:
          return (
            <View style={styles.vidview}>
              <RTCView
                // @ts-ignore
                streamURL={props.acuCall.state.remoteStream.toURL()}
                style={styles.rtcview}
              />
            </View>
          );
        case !props.acuCall.state.localVideoMuted &&
          props.acuCall.state.remoteVideoMuted:
          return (
            <View style={styles.vidview}>
              <Image
                source={require('./media/video_placeholder.png')}
                style={styles.videoPlaceholder}
              />
              <View style={styles.videoPlaceholder}>
                <Text style={styles.basicText}>NO VIDEO</Text>
              </View>
              <View style={styles.rtc}>
                <RTCView
                  // @ts-ignore
                  streamURL={props.acuCall.state.localStream.toURL()}
                  style={styles.rtcselfview}
                />
              </View>
            </View>
          );
        case props.acuCall.state.localVideoMuted &&
          props.acuCall.state.remoteVideoMuted:
          return (
            <View>
              <Image
                source={require('./media/video_placeholder.png')}
                style={styles.videoPlaceholder}
              />
              <View style={styles.videoPlaceholder}>
                <Text style={styles.basicText}>NO VIDEO</Text>
              </View>
            </View>
          );
        default:
          return (
            <View style={styles.vidview}>
              <RTCView
                // @ts-ignore
                streamURL={props.acuCall.state.remoteStream.toURL()}
                style={styles.rtcview}
              />
              <View style={styles.rtc}>
                <RTCView
                  // @ts-ignore
                  streamURL={props.acuCall.state.localStream.toURL()}
                  style={styles.rtcselfview}
                />
              </View>
            </View>
          );
      }
    } else {
      return <View />;
    }
  }
};

const CallDisplayHandler = (props: AcuCallProps) => {
  switch (props.acuCall.state.calling) {
    case 'client':
      return <DisplayClientCall acuCall={props.acuCall} />;
    case 'service':
      return <DialKeypad acuCall={props.acuCall} />;
    default:
      if (props.acuCall.state.inboundCall) {
        // incoming call display
        return (
          <View style={styles.center}>
            <Text style={styles.callingText}>Incoming Call</Text>
            <Text style={styles.callingText}>
              {props.acuCall.state.incomingCallClientId}
            </Text>
          </View>
        );
      } else {
        // idle display
        return (
          <ScrollView>
            <CallOutComponent acuCall={props.acuCall} />
          </ScrollView>
        );
      }
  }
};

const CallButtonsHandler = (props: AcuCallProps) => {
  if (
    props.acuCall.state.inboundCall &&
    props.acuCall.state.callState === 'incoming call'
  ) {
    //incoming call
    return <View />;
  } else if (
    props.acuCall.state.inboundCall ||
    props.acuCall.state.outboundCall
  ) {
    if (
      props.acuCall.state.calling === 'client' &&
      props.acuCall.state.callState === 'connected'
    ) {
      // client call connected
      return (
        <View>
          <ClientCallButtons acuCall={props.acuCall} />
          <MainCallButtons acuCall={props.acuCall} />
        </View>
      );
    } else {
      // client call not connected or service call
      return <MainCallButtons acuCall={props.acuCall} />;
    }
  } else {
    // idle state
    return <View />;
  }
};

const RegisterButton = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.registrationButton}>
      <RoundButton
        iconName={'cog-outline'}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

class AcuCall extends AculabCall {
  componentDidMount() {
    this.register();
    initializeCallKeep(appName);
    this.addCallKeepListeners();
  }

  componentWillUnmount() {
    this.unregister();
    this.destroyListeners();
  }

  componentDidUpdate() {
    if (this.state.callUIInteraction === 'answered' && this.state.inboundCall) {
      this.answerCall();
    }
  }

  onDisconnected(): void {
    super.onDisconnected();
    console.log('last call:', this.getLastCall());
  }

  CallHeadComponent = (): any => {
    return (
      <View style={styles.row}>
        <View style={styles.callHead}>
          <Text style={styles.basicText}>Aculab - AculabCall Example</Text>
          {this.state.client !== null ? (
            <View>
              <Text style={styles.basicText}>
                Registered as {this.props.registerClientId}
              </Text>
              <Text style={styles.basicText}>
                State: {this.state.callState}
              </Text>
            </View>
          ) : (
            <Text style={styles.warningText}>
              Please Use Correct Registration Credentials
            </Text>
          )}
        </View>
        {!this.state.inboundCall && !this.state.outboundCall ? (
          <RegisterButton />
        ) : (
          <View />
        )}
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.height100}>
        <this.CallHeadComponent />
        <View>
          <CallDisplayHandler acuCall={this} />
        </View>
        <View style={styles.bottom}>
          <CallButtonsHandler acuCall={this} />
        </View>
      </SafeAreaView>
    );
  }
}

export default AcuCall;
