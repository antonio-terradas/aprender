//first run this in terminal to work locally: export PW_EXECUTABLE_PATH=/Users/antonioterradas/Library/Caches/ms-playwright/webkit-1837/pw_run.sh
//now is not necesary because I have created run.sh ./run.sh for running




import { webkit } from 'playwright';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import fs from 'fs';

// Set the ISIN code
const ISIN = 'pictet-absolute-return-fixed-income/LU0988402656';

async function authenticateWithGoogle() {
  const doc = new GoogleSpreadsheet('1wX0K2Tfl2r3AAjneMVSq1ts_7vImJwYAduFefnahQb4');

  await doc.useServiceAccountAuth({
    client_email: 'service@certus-0970.iam.gserviceaccount.com',
    
    private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDiesljKNwqla8J\nJ6tIFTb3uBfSGmNqpL3y1HjbJ3yAHRyo3yiK9PzpIDbo4QeMUaRi96WfWeT1FoqS\nvsUWu2WhUA4T6+6R4kCVPwyj66wsuDoDDNij9gvfRNsQIG2hTHvy3Ur4o6g9UwQz\n50uVKk5Dmug/ZvPIwv3skU4bUrgUOWqnN7AbCFTnTtDfl7TMFuHbZdcOJXJfORsl\nQxqBZidUy8m225VW49HCS9nbEcNu79FrvPUjYCEcl2QTIgk3O+pL2znwyIqmSQRZ\nXJwIgMCDbujB2Er3Cf1FblG+xNzFIBpEIyZ8Dmfk0UaMopc/SklPM3083P9TNCCC\neZsQTpoVAgMBAAECggEAGfH5aTUwnRD0cjw2UzXZoWEDGuwv+x3FWZtn/v8+iYoM\nPaJXCYLjCFf1l7x+ego4+/zP309T5enqVRZVYMh2GO1MDOczN54vn4lktXtVsvJ7\nSYcquFnYZqsDh4zs0j9/VvAYBcpF3Jn1OiGjVy13YCelDJe1kjMYa4YCkym+RylM\n0GoblOFijmQ8L0TnzSQGhNMOCYT/m0HE/51rEQkLNeXWugOKU8MpG/UPq50As8Nb\n8oWkV1+TTwwabeTfi5ABUD0hVCSMh3qhhcy5KiV3xzEp/2VNHRaWunRT8XnrMVUF\nQ2EapjbodfCoI1KtsucF6hOUuywAvZsCOTtZ3wqHjwKBgQD9dny6+sp5ZfIQveNz\nwBtFaK1XuxKKsgiaFHJ7ZsiDBhlpgoMDFmmfHLgiSLr2erTJkVTxtqPWUBamC4IE\nBDbJb5j8MTYyiplzK6RuU20Idwzwz64ATnZ7jiLy5ERu/MBeqMVLKv2uIJwMTD81\n0u9QyvwYSpbGaKN1xbABzIWfVwKBgQDkvydJPtQTvXYCNoAq2+ZM3/Yq9WIqoUso\n7VD8z9AgYS/7XByje87LALP7BEPXxtPPSIzdxlAlIju2V0FzzZmvW5k+sw5olndb\nYWRPjE8F7A9ds/AjPVfkocs8Gm8VmmcoPuMDVLHdkYvLFoRLpLeNZSRkMvA2vGqt\nMhY362JqcwKBgQDZ1uogsccvS0UeynUgWK2Xm/3PdwLanWTzODukf5Q5uBZDLl53\nWt3wWHiRTr0RdijHTNca34Q0f6TXlPBrj0ufGQD9TzZrfd+gspOiFqWRLvC6T2QW\n81i1nFXBOBrw4N5c/OSEVDCvZWt4zldNZTs1zx+XqROo9un2IK/C/AqkBQKBgGJE\nZCIpJX5dc+a7dw/ya9s2k1AdHlDl/Z3VZWdV9zkRx0UaawsoUswOv0LksChwN+ni\nZvGXEjMBo9lPXsTa3Fzi4tB2p4fyq8/L5QXvZrtKj8dXV6Ar6ChGAUMOsA39yLcX\nXPq/VbGzpvRV9ftxBZFuk9WftGYvRzykObtIGX1VAoGBAIT7210TlU3x3YL8b0n4\n8UdReo82fQ4rmea2CJpSPRx7gZeDY+kEj3FEmhQ8IO4kFMu8V+BF0SwunUUVJQwC\nHsp1YgXFneiOJyT2Pjf6WpbyVArRnfqrJ8teWPtPaBfe8nS8yZdB6WnGyHyksAzb\nFB/gnq4NjYfT214znQ6ifOr/\n-----END PRIVATE KEY-----`.replace(/\\n/g, '\n')
  });


  await doc.loadInfo();
  return doc;
}

async function getNavValue(ISIN) {
  
  try {
    
  const browser = await webkit.launch({
  headless: true,
  executablePath: process.env.PW_EXECUTABLE_PATH,
  args: ['--no-sandbox']
});
    
    //const browser = await webkit.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`Navigating to https://am.pictet/es/spain/individual/funds/${ISIN}`);
    await page.goto(`https://am.pictet/es/spain/individual/funds/${ISIN}`);

    console.log('Waiting for the "Inversor particular" link to appear');
    await page.waitForSelector('a#complianceButton', { state: 'visible' });

    console.log('Clicking on the "Inversor particular" link');
    await page.click('a#complianceButton');

    console.log('Waiting for the page to finish loading');
    await page.waitForSelector('.Stats__value', { state: 'visible' });

    const navValue = await page.$('.Stats__value');
    const nav = await navValue.textContent();
    console.log(`NAV: ${nav}`);

    const doc = await authenticateWithGoogle();
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells('A1:C1');
    const dateCell = sheet.getCell(0, 2);
    const navCell = sheet.getCell(0, 1);
    dateCell.value = new Date().toISOString();
    navCell.value = nav;
    await sheet.saveUpdatedCells();

    await browser.close();

    console.log('Script executed successfully');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Execute the trace script
getNavValue(ISIN);