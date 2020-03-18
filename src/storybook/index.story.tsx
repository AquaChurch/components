import React from 'react';
import { storiesOf } from '@storybook/react';
import './styles.scss';
import '@powerfulyang/utils/index.css';
import PhotoSlider from '../wrapper/PhotoSlider';

storiesOf('Welcome', module).add('example', () => {
  return <PhotoSlider />;
});
