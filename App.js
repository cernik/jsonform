/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Button,
  LayoutAnimation,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

import {Formik} from 'formik';

import jsonform from './samples/sample.json';

const App: () => React$Node = () => {
  const [sample, setSample] = React.useState(jsonform);

  React.useEffect(() => {
    fetch(
      'https://gist.githubusercontent.com/cernik/aebe78133d2e0fbfc64c974993d3c308/raw/6673224b6cdc23fbf96903818e44b015cd95c11b/sample.json',
    )
      .then((response) => response.json())
      .then((json) => {
        console.log('json', json);
        setSample(json);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const renderField = (field, props) => {
    const {handleChange, handleBlur, setFieldValue, values} = props;

    if (field.subtype === 'checkbox') {
      if (!field.enabled) {
        return null;
      }
      return (
        <View key={field.id} style={{marginTop: 16}}>
          <Text style={{marginStart: 4}}>{field.label || ''}</Text>

          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setFieldValue(field.id, !values[field.id]);
            }}
            style={{
              margin: 4,
              height: 20,
              width: 20,
              borderWidth: 1,
            }}>
            {values[field.id] && (
              <View
                style={{
                  margin: 3,
                  backgroundColor: 'grey',
                  flex: 1,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      );
    }
    let keyboardType = 'default';
    if (field.subtype === 'number') {
      keyboardType = 'number-pad';
    } else if (field.subtype === 'email') {
      keyboardType = 'email-address';
    }
    if (field.enabled === false) {
      return null;
    }

    if (typeof field.depenedOn === 'object' && Array.isArray(field.depenedOn)) {
      const [parentFieldId, parentFieldValue] = field.depenedOn;
      if (values[parentFieldId] !== parentFieldValue) {
        return null;
      }
    }
    return (
      <View key={field.id}>
        <TextField
          label={field.label}
          keyboardType={keyboardType}
          onChangeText={handleChange(field.id)}
          onBlur={handleBlur(field.id)}
          value={String(values[field.id] || '')}
          placeholder={field.placeholder}
          style={{}}
        />
      </View>
    );
  };

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header style={{height: 80}} />
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Formik
                enableReinitialize
                initialValues={sample.fields.reduce(
                  (acc, f) => ({
                    ...acc,
                    [f.id]: f.value,
                  }),
                  {},
                )}
                onSubmit={(values) => alert(JSON.stringify(values, null, 2))}>
                {(props) => (
                  <React.Fragment>
                    {sample.fields.map((field) => renderField(field, props))}
                    <Button onPress={props.handleSubmit} title="Submit" />
                  </React.Fragment>
                )}
              </Formik>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
