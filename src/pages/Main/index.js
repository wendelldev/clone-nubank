import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'

import { StatusBar, Animated } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'

import Header from '~/Components/Header'
import Tabs from '~/Components/Tabs'
import Menu from '~/Components/Menu'

import { Container, Content, Card, CardHeader, CardContent, CardFooter, Title, Description, Annotation } from './styles'

export default function Main() {
  let offset = 0

  const translateY = new Animated.Value(0)

  const animatedEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: translateY,
        }
      }
    ],
    { useNativeDriver: true },
  )

  function onHandlerStateChanged(event) {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let opened = false

      const { translationY } = event.nativeEvent

      offset += translationY

      if (translationY >= 50) {
        opened = true
      } else {
        translateY.setValue(offset)
        translateY.setOffset(0)
        offset = 0
      }

      Animated.timing(translateY, {
        toValue: opened ? 380 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        offset = opened ? 380 : 0
        translateY.setOffset(offset)
        translateY.setValue(0)
      })
    }
  }

  return (
    <>
    <StatusBar barStyle='light-content' backgroundColor='#8b10ae' />
    <Container>
      <Header />
      <Content>
        <Menu translateY={translateY} />
        <PanGestureHandler
          onGestureEvent={animatedEvent}
          onHandlerStateChange={onHandlerStateChanged}
        >
          <Card style={{
            transform: [{
              translateY: translateY.interpolate({
                inputRange: [-20, 0, 380],
                outputRange: [-3, 0, 380],
                extrapolate: 'clamp',
              }),
            }]
          }}>
            <CardHeader>
              <Icon name="attach-money" size={28} color="#666" />
              <Icon name="visibility-off" size={28} color="#666" />
            </CardHeader>
            <CardContent>
              <Title>Saldo disponível</Title>
              <Description>R$ 197.611,65</Description>
            </CardContent>
            <CardFooter>
              <Annotation>
                Transferência de R$ 20,00 recebida de Wendell Lucena hoje às 18:00h
              </Annotation>
            </CardFooter>
          </Card>
        </PanGestureHandler>
      </Content>
      <Tabs translateY={translateY} />
    </Container>
    </>
  )
}