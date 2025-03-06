import { Pi } from 'pi-network-sdk'; // Adjust the import based on your SDK

Pi.init({
  apiKey: 'GC7R5QICNKBDFRABMCJNHGS6OO2SQFPZTKFTOTP2ZKQQGIVUY55FHE7L',
  environment: 'sandbox' // or 'production'
}).then(() => {
  // SDK is initialized, now you can call other methods
  Pi.someMethod();
}).catch((error) => {
  console.error('Failed to initialize Pi Network SDK:', error);
});
