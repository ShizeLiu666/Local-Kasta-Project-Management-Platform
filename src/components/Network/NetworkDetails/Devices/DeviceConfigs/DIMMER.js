/**
 * DIMMER Device Configuration
 * Defines the properties and form configuration for Dimmer devices
 */

const DIMMER_CONFIG = {
  // Device attributes configuration
  attributes: {
    power: { 
      type: 'select', 
      label: 'Power', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state (0=Off, 1=On)'
    },
    level: { 
      type: 'number', 
      label: 'level', 
      min: 0, 
      max: 255,
      description: 'Brightness level (0-255, displays as 0-100%)'
    },
    delay: { 
      type: 'number', 
      label: 'Delay', 
      min: 0, 
      max: 59,
      description: 'Delay time in minutes (0-59)'
    }
  },
  
  // Device description
  description: 'Dimmer device for controlling light brightness',
  
  // Device icon
  icon: 'DIMMER.png',
  
  // Device category
  category: 'lighting',
  
  // Helper functions for dimmer state display
  helpers: {
    getPowerStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Off';
        case 1: return 'On';
        default: return '-';
      }
    },
    getDimmingPercentage: (level) => {
      if (level === undefined || level === null) return '-';
      return `${Math.round((level / 255) * 100)}%`;
    },
    getDelayMinutes: (delay) => {
      if (delay === undefined || delay === null) return '-';
      return `${delay} min`;
    }
  }
};

export default DIMMER_CONFIG; 