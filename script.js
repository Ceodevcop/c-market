import { Pi } from 'pi-network-sdk'; // Adjust the import based on your SDK

Pi.init({
  apiKey: 'dmcfgx7myqzcsamt7mv4qxblszendpfzfvqiqfdmb5ymyotsthnfbeu20qactsng',
  environment: 'sandbox' // or 'production'
}).then(() => {
  // SDK is initialized, now you can call other methods
  Pi.someMethod();
}).catch((error) => {
  console.error('Failed to initialize Pi Network SDK:', error);
});
