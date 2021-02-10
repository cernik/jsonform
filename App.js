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
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {Formik} from 'formik';

import jsonform from './samples/sample2.json';

const App: () => React$Node = () => {
  const [sample, setSample] = React.useState(jsonform);
  const [sampleText, setSampleText] = React.useState('sampleText');

  React.useEffect(() => {
    fetch(
      'https://gist.githubusercontent.com/cernik/aebe78133d2e0fbfc64c974993d3c308/raw/45d7e1ecd278f4ac3c657e73819a40219f34949d/sample.json',
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
    const {
      handleChange,
      handleSubmit,
      handleBlur,
      setFieldValue,
      values,
      setFieldTouched,
    } = props;

    if (field.subtype === 'checkbox') {
      if (!field.enabled) {
        return null;
      }

      const handlePress = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFieldValue(field.id, !values[field.id]);
      };

      return (
        <View key={field.id} style={{marginTop: 16}}>
          <Text>{field.label || ''}</Text>
          <TouchableOpacity
            onPress={handlePress}
            style={styles.checkboxContainer}>
            {values[field.id] && <View style={styles.checkboxValue} />}
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

    const events = field.events;
    let customOnChange;
    if (events && events.onChangeText && events.onChangeText) {
      customOnChange = eval(events.onChangeText);
    }

    const onChange = (val) => {
      setFieldValue(field.id, val);
      if (customOnChange) {
        customOnChange(val, props);
      }
    };

    return (
      <TextField
        key={field.id}
        label={field.label}
        keyboardType={keyboardType}
        onChangeText={onChange}
        onBlur={handleBlur(field.id)}
        value={String(values[field.id] || '')}
        placeholder={field.placeholder}
      />
    );
  };

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}>
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
            <View style={styles.sampleText}>
              <Text>{sampleText}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flex: 1,
  },
  sampleText: {
    flex: 1,
    borderWidth: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginVertical: 8,
    height: 20,
    width: 20,
    borderWidth: 1,
  },
  checkboxValue: {
    margin: 3,
    backgroundColor: 'grey',
    flex: 1,
  },
});

export default App;
